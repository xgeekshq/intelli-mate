import { MemoryService } from '@/ai/services/memory.service';
import { Injectable } from '@nestjs/common';
import { ConversationChain } from 'langchain/chains';
import { BaseChatModel } from 'langchain/chat_models';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from 'langchain/prompts';

@Injectable()
export class ChainService {
  chainMap: Map<string, ConversationChain>;
  defaultChatPrompt: ChatPromptTemplate;

  constructor(private readonly memoryService: MemoryService) {
    this.chainMap = new Map<string, ConversationChain>();
    this.defaultChatPrompt = ChatPromptTemplate.fromPromptMessages([
      new MessagesPlaceholder('history'),
      HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);
  }

  getChain(
    chatId: string,
    llmModel: BaseChatModel,
    summary?: string
  ): ConversationChain {
    if (!this.hasChain(chatId) || !!summary) {
      this.createChain(chatId, llmModel, summary);
    }

    return this.chainMap.get(chatId);
  }

  private hasChain(chatId: string): boolean {
    return this.chainMap.has(chatId);
  }

  private createChain(
    chatId: string,
    llmModel: BaseChatModel,
    summary?: string
  ) {
    this.chainMap.set(
      chatId,
      new ConversationChain({
        llm: llmModel,
        prompt: this.defaultChatPrompt,
        memory: this.memoryService.getMemory(chatId, summary),
      })
    );
  }
}
