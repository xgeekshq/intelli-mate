import { AiModelsRepository } from '@/ai/ai-models.repository';
import { createChatLlmModelFactory } from '@/ai/factories/create-chat-model.factory';
import { AppConfigService } from '@/app-config/app-config.service';
import { AiModel } from '@/common/types/ai-models';
import { Injectable } from '@nestjs/common';
import { BaseChatModel } from 'langchain/chat_models';

@Injectable()
export class ChatModelService {
  chatModelMap: Map<string, BaseChatModel>;

  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly aiModelRepository: AiModelsRepository
  ) {
    this.chatModelMap = new Map();
  }

  async getChatModel(chatLlm: string) {
    const chatLlmOptions = await this.aiModelRepository.findAiModel(chatLlm);
    if (!this.hasChatModel(chatLlm)) {
      this.createChatModel(chatLlm, chatLlmOptions);
    }
    return this.chatModelMap.get(chatLlm);
  }
  private hasChatModel(chatLlm: string): boolean {
    return this.chatModelMap.has(chatLlm);
  }

  private createChatModel(chatLlm: string, chatLlmOptions: AiModel) {
    this.chatModelMap.set(chatLlm, createChatLlmModelFactory(chatLlmOptions));
  }
}
