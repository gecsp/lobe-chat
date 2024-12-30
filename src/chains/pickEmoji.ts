import { ChatStreamPayload } from '@/types/openai/chat';

/**
 * pick emoji for user prompt
 * @param content
 */
export const chainPickEmoji = (content: string): Partial<ChatStreamPayload> => ({
  messages: [
    {
      content:
        'You are a designer and Emoji expert skilled in concept abstraction. You need to abstract a physical entity concept Emoji as a role avatar based on the role capability description. The format requirements are as follows:\nInput: {text as JSON quoted string}\nOutput: {one Emoji}.',
      role: 'system',
    },
    {
      content: `Input: {You are a copywriting master who helps name design/art works. The names need to have literary connotations, focus on refinement and artistic conception, express the scene atmosphere of the works, making the names both concise and poetic.}`,
      role: 'user',
    },
    { content: '✒️', role: 'assistant' },
    {
      content: `Input: {You are a code wizard. Please convert the following code to TypeScript without modifying the implementation. If there are global variables not defined in the original JavaScript, you need to add declare type declarations.}`,
      role: 'user',
    },
    { content: '🧙‍♂️', role: 'assistant' },
    {
      content: `Input: {You are a startup plan writing expert who can provide plan generation including creative names, short slogans, target user profiles, user pain points, main value propositions, sales/marketing channels, revenue streams, and cost structures.}`,
      role: 'user',
    },
    { content: '🚀', role: 'assistant' },
    { content: `Input: {${content}}`, role: 'user' },
  ],
});
