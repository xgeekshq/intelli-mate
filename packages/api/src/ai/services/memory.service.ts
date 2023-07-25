import { AppConfigService } from '@/app-config/app-config.service';
import { CACHE_CLIENT } from '@/common/constants/cache';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { AIChatMessage } from 'langchain/schema';
import { RedisChatMessageHistory } from 'langchain/stores/message/redis';
import { RedisClientType } from 'redis';
import { appendSuffixesIfMatch } from 'ts-loader/dist/utils';

@Injectable()
export class MemoryService {
  memoryMap: Map<string, BufferMemory>;

  constructor(
    @Inject(CACHE_CLIENT)
    private readonly cacheClient: RedisClientType,
    private readonly appConfigService: AppConfigService
  ) {
    this.memoryMap = new Map<string, BufferMemory>();
  }

  getMemory(chatId: string, summary?: string): BufferMemory {
    if (!!summary) {
      this.createMemoryWithSummary(chatId, summary);
    }

    if (!this.hasMemory(chatId)) {
      this.createMemory(chatId);
    }

    return this.memoryMap.get(chatId);
  }

  private hasMemory(chatId: string): boolean {
    return this.memoryMap.has(chatId);
  }

  private createMemory(chatId: string) {
    this.memoryMap.set(
      chatId,
      new BufferMemory({
        returnMessages: true,
        memoryKey: 'history',
        chatHistory: new RedisChatMessageHistory({
          sessionId: chatId,
          client: this.cacheClient,
          sessionTTL:
            this.appConfigService.getAiAppConfig().defaultChatContextTTL,
        }),
      })
    );
  }

  private createMemoryWithSummary(chatId: string, summary: string) {
    this.memoryMap.set(
      chatId,
      new BufferMemory({
        returnMessages: true,
        memoryKey: 'history',
        chatHistory: new ChatMessageHistory([new AIChatMessage(summary)]),
      })
    );
  }
}
