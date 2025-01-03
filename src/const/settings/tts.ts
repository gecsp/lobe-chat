import { UserTTSConfig } from '@/types/user/settings';

export const DEFAULT_TTS_CONFIG: UserTTSConfig = {
  openAI: {
    sttModel: 'whisper-1',
    ttsModel: 'tts-1-hd',
  },
  sttAutoStop: true,
  sttServer: 'openai',
};
