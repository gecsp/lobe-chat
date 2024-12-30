import { ModelProvider } from '@/libs/agent-runtime';
import { genUserLLMConfig } from '@/utils/genUserLLMConfig';

export const DEFAULT_LLM_CONFIG = genUserLLMConfig({
  ollama: {
    enabled: true,
    fetchOnClient: true,
  },
  openai: {
    enabled: true,
  },
});

export const DEFAULT_MODEL = 'claude-3-5-sonnet-20241022';
export const DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-large';

export const DEFAULT_PROVIDER = ModelProvider.Anthropic;
