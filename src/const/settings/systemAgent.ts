import {
  QueryRewriteSystemAgent,
  SystemAgentItem,
  UserSystemAgentConfig,
} from '@/types/user/settings';

import { DEFAULT_SMALL_MODEL, DEFAULT_SMALL_PROVIDER } from './llm';

export const DEFAULT_REWRITE_QUERY =
  'Given the following conversation and a follow-up question, rephrase the follow up question to be a standalone question, in its original language. Keep as much details as possible from previous messages. Keep entity names and all.';

export const DEFAULT_SYSTEM_AGENT_ITEM: SystemAgentItem = {
  model: DEFAULT_SMALL_MODEL,
  provider: DEFAULT_SMALL_PROVIDER,
};

export const DEFAULT_QUERY_REWRITE_SYSTEM_AGENT_ITEM: QueryRewriteSystemAgent = {
  enabled: true,
  model: DEFAULT_SMALL_MODEL,
  provider: DEFAULT_SMALL_PROVIDER,
};

export const DEFAULT_SYSTEM_AGENT_CONFIG: UserSystemAgentConfig = {
  agentMeta: DEFAULT_SYSTEM_AGENT_ITEM,
  historyCompress: DEFAULT_SYSTEM_AGENT_ITEM,
  queryRewrite: DEFAULT_QUERY_REWRITE_SYSTEM_AGENT_ITEM,
  thread: DEFAULT_SYSTEM_AGENT_ITEM,
  topic: DEFAULT_SYSTEM_AGENT_ITEM,
  translation: DEFAULT_SYSTEM_AGENT_ITEM,
};
