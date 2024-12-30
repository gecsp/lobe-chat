import { globalHelpers } from '@/store/user/helpers';
import { ChatStreamPayload, OpenAIChatMessage } from '@/types/openai/chat';

export const chainSummaryTitle = (messages: OpenAIChatMessage[]): Partial<ChatStreamPayload> => {
  const lang = globalHelpers.getCurrentLanguage();

  return {
    messages: [
      {
        content: 'You are an assistant skilled in conversation who needs to summarize user conversations into titles within 10 characters.',
        role: 'system',
      },
      {
        content: `${messages.map((message) => `${message.role}: ${message.content}`).join('\n')}

Please summarize the above conversation into a title within 10 characters, without punctuation marks, output language: ${lang}`,
        role: 'user',
      },
    ],
  };
};
