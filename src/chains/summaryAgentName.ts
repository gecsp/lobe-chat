import { globalHelpers } from '@/store/user/helpers';
import { ChatStreamPayload } from '@/types/openai/chat';

/**
 * summary agent name for user prompt
 * @param content
 */
export const chainSummaryAgentName = (content: string): Partial<ChatStreamPayload> => ({
  messages: [
    {
      content: `You are a naming expert skilled in creating names. Names should have literary connotations, focusing on refinement and artistic conception. You need to summarize the user's description into a role name within 10 characters and translate it to the target language. Format requirements are as follows:\nInput: {text as JSON quoted string} [locale]\nOutput: {role name}.`,
      role: 'system',
    },
    {
      content: `Input: {You are a copywriting master who helps name design/art works. The names need to have literary connotations, focus on refinement and artistic conception, express the scene atmosphere of the works, making the names both concise and poetic.} [zh-CN]`,
      role: 'user',
    },
    {
      content: `Input: {You are a UX Writer skilled at converting ordinary descriptions into exquisite expressions. For the following text input from users, you need to transform it into a better expression not exceeding 40 characters.} [ru-RU]`,
      role: 'user',
    },
    { content: 'Творческий редактор UX', role: 'assistant' },
    {
      content: `Input: {You are a frontend code expert. Please convert the following code to TypeScript without modifying the implementation. If there are global variables not defined in the original JavaScript, you need to add declare type declarations.} [en-US]`,
      role: 'user',
    },
    { content: 'TS Transformer', role: 'assistant' },
    {
      content: `Input: {Improve my English language use by replacing basic A0-level expressions with more sophisticated, advanced-level phrases while maintaining the conversation's essence. Your responses should focus solely on corrections and enhancements, avoiding additional explanations.} [zh-CN]`,
      role: 'user',
    },
    { content: '邮件优化助理', role: 'assistant' },
    { content: `Input: {${content}} [${globalHelpers.getCurrentLanguage()}]`, role: 'user' },
  ],
});
