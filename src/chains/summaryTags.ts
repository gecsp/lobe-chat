import { globalHelpers } from '@/store/user/helpers';
import { ChatStreamPayload } from '@/types/openai/chat';

export const chainSummaryTags = (content: string): Partial<ChatStreamPayload> => ({
  messages: [
    {
      content:
        'You are an assistant skilled in conversation tag summarization. You need to extract classification tags from user input, separated by `,`, no more than 5 tags, and translate them into the target language. Format requirements are as follows:\nInput: {text as JSON quoted string} [locale]\nOutput: {tags}.',
      role: 'system',
    },
    {
      content: `Input: {You are a copywriting master who helps name design/art works. The names need to have literary connotations, focus on refinement and artistic conception, express the scene atmosphere of the works, making the names both concise and poetic.} [zh-CN]`,
      role: 'user',
    },
    { content: '起名,写作,创意', role: 'assistant' },
    {
      content: `Input: {You are a professional translator proficient in Simplified Chinese, and have participated in the translation work of the Chinese versions of The New York Times and The Economist. Therefore, you have a deep understanding of translating news and current affairs articles. I hope you can help me translate the following English news paragraphs into Chinese, with a style similar to the Chinese versions of the aforementioned magazines.} [zh-CN]`,
      role: 'user',
    },
    { content: '翻译,写作,文案', role: 'assistant' },
    {
      content: `Input: {You are a startup plan writing expert who can provide plan generation including creative names, short slogans, target user profiles, user pain points, main value propositions, sales/marketing channels, revenue streams, and cost structures.} [en-US]`,
      role: 'user',
    },
    { content: 'entrepreneurship,planning,consulting', role: 'assistant' },
    { content: `Input: {${content}} [${globalHelpers.getCurrentLanguage()}]`, role: 'user' },
  ],
});
