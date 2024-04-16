import { AiModelsRepository } from '@/ai/ai-models.repository';
import { createChatLlmModelFactory } from '@/ai/factories/create-chat-model.factory';
import { AppConfigService } from '@/app-config/app-config.service';
import { AiModel } from '@/common/types/ai-models';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatModelService {
  chatModelMap: Map<string, BaseChatModel>;

  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly aiModelRepository: AiModelsRepository
  ) {
    this.chatModelMap = new Map();
  }

  async getChatModel(chatLlmId: string) {
    if (!this.hasChatModel(chatLlmId)) {
      const chatLlmOptions = await this.aiModelRepository.findAiModel(
        chatLlmId
      );
      this.createChatModel(chatLlmId, chatLlmOptions);
    }
    return this.chatModelMap.get(chatLlmId);
  }
  private hasChatModel(chatLlmId: string): boolean {
    return this.chatModelMap.has(chatLlmId);
  }

  private createChatModel(chatLlmId: string, chatLlmOptions: AiModel) {
    this.chatModelMap.set(chatLlmId, createChatLlmModelFactory(chatLlmOptions));
  }
}
