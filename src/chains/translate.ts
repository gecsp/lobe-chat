import { ChatStreamPayload } from '@/types/openai/chat';

export const chainTranslate = (
  content: string,
  targetLang: string,
): Partial<ChatStreamPayload> => ({
  messages: [
    {
      content: 'You are an assistant skilled in translation who needs to translate the input language into the target language.',
      role: 'system',
    },
    {
      content: `Please translate the following content ${content} into ${targetLang}`,
      role: 'user',
    },
  ],
});
