import { globalHelpers } from '@/store/user/helpers';
import { ChatStreamPayload } from '@/types/openai/chat';

export const chainSummaryDescription = (content: string): Partial<ChatStreamPayload> => ({
  messages: [
    {
      content: `You are an assistant skilled in skill summarization. You need to summarize the user's input into a role skill profile, not exceeding 20 characters. The content needs to ensure clear information, clear logic, and effectively convey the role's skills and experience, and needs to be translated into the target language:${globalHelpers.getCurrentLanguage()}. Format requirements are as follows:\nInput: {text as JSON quoted string} [locale]\nOutput: {profile}.`,
      role: 'system',
    },
    {
      content: `Input: {You are a copywriting master who helps name design/art works. The names need to have literary connotations, focus on refinement and artistic conception, express the scene atmosphere of the works, making the names both concise and poetic.} [zh-CN]`,
      role: 'user',
    },
    { content: '擅长文创艺术作品起名', role: 'assistant' },
    {
      content: `Input: {You are a startup plan writing expert who can provide plan generation including creative names, short slogans, target user profiles, user pain points, main value propositions, sales/marketing channels, revenue streams, and cost structures.} [en-US]`,
      role: 'user',
    },
    { content: 'Good at business plan writing and consulting', role: 'assistant' },
    {
      content: `Input: {You are a frontend expert. Please convert the code below to TS without modifying the implementation. If there are global variables not defined in the original JS, you need to add type declarations using declare.} [zh-CN]`,
      role: 'user',
    },
    { content: '擅长 ts 转换和补充类型声明', role: 'assistant' },
    {
      content: `Input: {
Users write API user documentation for developers normally. You need to provide more user-friendly and readable documentation content from the user's perspective.\n\nA standard API documentation example is as follows:\n\n\`\`\`markdown
---
title: useWatchPluginMessage
description: Monitor and receive plugin messages from LobeChat
nav: API
---\n\n\`useWatchPluginMessage\` is a React Hook encapsulated by Chat Plugin SDK for monitoring plugin messages from LobeChat.
} [ru-RU]`,
      role: 'user',
    },
    {
      content:
        'Специализируется на создании хорошо структурированной и профессиональной документации README для GitHub с точными техническими терминами',
      role: 'assistant',
    },
    {
      content: `Input: {You are a startup plan writing expert who can provide plan generation including creative names, short slogans, target user profiles, user pain points, main value propositions, sales/marketing channels, revenue streams, and cost structures.} [zh-CN]`,
      role: 'user',
    },
    { content: '擅长创业计划撰写与咨询', role: 'assistant' },
    { content: `Input: {${content}} [${globalHelpers.getCurrentLanguage()}]`, role: 'user' },
  ],
  temperature: 0,
});
