import { TRPCError } from '@trpc/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import Google from '@google/generative-ai';
import { z } from 'zod';

import { chainAnswerWithContext } from '@/chains/answerWithContext';
import { DEFAULT_EMBEDDING_MODEL, DEFAULT_EMBEDDING_PROVIDER, DEFAULT_SMALL_MODEL, DEFAULT_SMALL_PROVIDER } from '@/const/settings';
import { serverDB } from '@/database/server';
import { ChunkModel } from '@/database/server/models/chunk';
import { EmbeddingModel } from '@/database/server/models/embedding';
import { FileModel } from '@/database/server/models/file';
import {
  EvalDatasetRecordModel,
  EvalEvaluationModel,
  EvaluationRecordModel,
} from '@/database/server/models/ragEval';
import { asyncAuthedProcedure, asyncRouter as router } from '@/libs/trpc/async';
import { initAgentRuntimeWithUserPayload } from '@/server/modules/AgentRuntime';
import { ChunkService } from '@/server/services/chunk';
import { AsyncTaskError } from '@/types/asyncTask';
import { EvalEvaluationStatus } from '@/types/eval';

const ragEvalProcedure = asyncAuthedProcedure.use(async (opts) => {
  const { ctx } = opts;

  return opts.next({
    ctx: {
      chunkModel: new ChunkModel(serverDB, ctx.userId),
      chunkService: new ChunkService(ctx.userId),
      datasetRecordModel: new EvalDatasetRecordModel(ctx.userId),
      embeddingModel: new EmbeddingModel(serverDB, ctx.userId),
      evalRecordModel: new EvaluationRecordModel(ctx.userId),
      evaluationModel: new EvalEvaluationModel(ctx.userId),
      fileModel: new FileModel(serverDB, ctx.userId),
    },
  });
});

export const ragEvalRouter = router({
  runRecordEvaluation: ragEvalProcedure
    .input(
      z.object({
        evalRecordId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const evalRecord = await ctx.evalRecordModel.findById(input.evalRecordId);

      if (!evalRecord) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Evaluation not found' });
      }

      const now = Date.now();
      try {
        const embeddingsAgentRuntime = await initAgentRuntimeWithUserPayload(
          DEFAULT_EMBEDDING_PROVIDER,
          ctx.jwtPayload,
        );

        const smallModelAgentRuntime = await initAgentRuntimeWithUserPayload(
          DEFAULT_SMALL_PROVIDER,
          ctx.jwtPayload,
        );

        const { question, languageModel, embeddingModel } = evalRecord;

        let questionEmbeddingId = evalRecord.questionEmbeddingId;
        let context = evalRecord.context;

        // If questionEmbeddingId doesn't exist, we need to perform an embedding
        if (!questionEmbeddingId) {
          const embeddings = await embeddingsAgentRuntime.embeddings({
            dimensions: 1024,
            input: question,
            model: !!embeddingModel ? embeddingModel : DEFAULT_EMBEDDING_MODEL,
          });

          const embeddingId = await ctx.embeddingModel.create({
            embeddings: embeddings?.[0],
            model: embeddingModel,
          });

          await ctx.evalRecordModel.update(evalRecord.id, {
            questionEmbeddingId: embeddingId,
          });

          questionEmbeddingId = embeddingId;
        }

        // If context doesn't exist, we need to perform a retrieval
        if (!context || context.length === 0) {
          const datasetRecord = await ctx.datasetRecordModel.findById(evalRecord.datasetRecordId);

          const embeddingItem = await ctx.embeddingModel.findById(questionEmbeddingId);

          const chunks = await ctx.chunkModel.semanticSearchForChat({
            embedding: embeddingItem!.embeddings!,
            fileIds: datasetRecord!.referenceFiles!,
            query: evalRecord.question,
          });

          context = chunks.map((item) => item.text).filter(Boolean) as string[];
          await ctx.evalRecordModel.update(evalRecord.id, { context });
        }

        // Generate LLM answer
        const { messages } = chainAnswerWithContext({ context, knowledge: [], question });

        const response = await smallModelAgentRuntime.chat({
          messages: messages!,
          model: !!languageModel ? languageModel : DEFAULT_SMALL_MODEL,
          responseMode: 'json',
          stream: false,
          temperature: 1,
        });

        const rawData = await response.json();
        let data;
        let answer;

        switch (DEFAULT_SMALL_PROVIDER.toLowerCase()) {
          case 'anthropic': {
            data = rawData as Anthropic.Completions.Completion;
            answer = data.completion;
            break;
          }
          case 'google': {
            data = rawData as Google.GenerateContentResult;
            answer = data.response.text();
            break;
          }
          default: {
            data = rawData as OpenAI.ChatCompletion;
            answer = data.choices[0].message.content;
          }
        }

        await ctx.evalRecordModel.update(input.evalRecordId, {
          answer,
          duration: Date.now() - now,
          languageModel,
          status: EvalEvaluationStatus.Success,
        });

        return { success: true };
      } catch (e) {
        await ctx.evalRecordModel.update(input.evalRecordId, {
          error: new AsyncTaskError((e as Error).name, (e as Error).message),
          status: EvalEvaluationStatus.Error,
        });

        await ctx.evaluationModel.update(evalRecord.evaluationId, {
          status: EvalEvaluationStatus.Error,
        });

        console.error('[RAGEvaluation] error', e);

        return { success: false };
      }
    }),
});
