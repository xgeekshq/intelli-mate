import { AiModel } from '@/common/types/ai-models';
import { decrypt } from '@/common/utils/encrypt-string';
import { BaseChatModel } from 'langchain/chat_models';
import { ChatMinimax } from 'langchain/chat_models/minimax';
import { ChatOpenAI } from 'langchain/chat_models/openai';

type Model = 'ChatOpenAI' | 'ChatMinimax';

const ModelMapper: Record<Model, (configs: AiModel) => BaseChatModel> = {
  ChatOpenAI: (config) => {
    return new ChatOpenAI({
      openAIApiKey: decrypt(config.meta['apiKey']),
      temperature: config.temperature,
      modelName: config.modelName,
    });
  },
  ChatMinimax: (config) => {
    return new ChatMinimax({
      proVersion: false,
      tokensToGenerate: 1000,
      modelName: config.modelName,
      minimaxGroupId: config.meta['groupId'],
      minimaxApiKey: decrypt(config.meta['apiKey']),
      temperature: config.temperature,
    });
  },
};

export function createChatLlmModelFactory(
  chatModelConfig: AiModel
): BaseChatModel {
  return ModelMapper[chatModelConfig.chatLlmName](chatModelConfig);
}
