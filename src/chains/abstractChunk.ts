import { DEFAULT_SMALL_MODEL } from '@/const/settings';
import { ChatStreamPayload } from '@/types/openai/chat';

export const chainAbstractChunkText = (text: string): Partial<ChatStreamPayload> => {
  return {
    messages: [
      {
        content:
          'You are an assistant skilled at extracting summaries from chunks. You need to summarize the user\'s conversation into 1-2 sentences as an abstract, and output it in the same language used in the chunk',
        role: 'system',
      },
      {
        content: `chunk: ${text}`,
        role: 'user',
      },
    ],
    model: DEFAULT_SMALL_MODEL,
  };
};

