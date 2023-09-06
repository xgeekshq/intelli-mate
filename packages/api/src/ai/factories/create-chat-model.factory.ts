import { AiModel } from '@/common/types/ai-models';
import { decrypt } from '@/common/utils/encrypt-string';
import { BaseChatModel } from 'langchain/chat_models';
import { ChatOpenAI } from 'langchain/chat_models/openai';

type Model = 'ChatOpenAI';

const ModelMapper: Record<Model, (configs: AiModel) => BaseChatModel> = {
  ChatOpenAI: (config) => {
    return new ChatOpenAI({
      openAIApiKey: decrypt(config.meta['apiKey']),
      temperature: config.temperature,
      modelName: config.modelName,
    });
  },
};

export function createChatLlmModelFactory(
  chatModelConfig: AiModel
): BaseChatModel {
  return ModelMapper[chatModelConfig.chatLlmName](chatModelConfig);
}
