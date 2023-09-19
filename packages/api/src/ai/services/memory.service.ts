import { AppConfigService } from '@/app-config/app-config.service';
import { CACHE_CLIENT } from '@/common/constants/cache';
import { Inject, Injectable } from '@nestjs/common';
import { BufferMemory } from 'langchain/memory';
import { RedisChatMessageHistory } from 'langchain/stores/message/redis';
import { RedisClientType } from 'redis';

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

  async getMemory(roomId: string, summary?: string): Promise<BufferMemory> {
    if (!!summary) {
      await this.memoryMap.get(roomId).clear();
      await this.createMemoryWithSummary(roomId, summary);
    }
    if (!this.hasMemory(roomId)) {
      this.createMemory(roomId);
    }

    return this.memoryMap.get(roomId);
  }

  async deleteMemory(roomId: string) {
    await this.cacheClient.del(roomId);
    this.memoryMap.delete(roomId);
  }

  private hasMemory(roomId: string): boolean {
    return this.memoryMap.has(roomId);
  }

  private createMemory(roomId: string) {
    this.memoryMap.set(
      roomId,
      new BufferMemory({
        returnMessages: true,
        memoryKey: 'history',
        chatHistory: new RedisChatMessageHistory({
          sessionId: roomId,
          client: this.cacheClient,
          sessionTTL:
            this.appConfigService.getAiAppConfig().defaultChatContextTTL,
        }),
      })
    );
  }

  private async createMemoryWithSummary(roomId: string, summary: string) {
    const redisChatSummary = new RedisChatMessageHistory({
      sessionId: roomId,
      client: this.cacheClient,
      sessionTTL: this.appConfigService.getAiAppConfig().defaultChatContextTTL,
    });
    await redisChatSummary.addAIChatMessage(summary);
    this.memoryMap.set(
      roomId,
      new BufferMemory({
        returnMessages: true,
        memoryKey: 'history',
        chatHistory: redisChatSummary,
      })
    );
  }

  async createMemoryWithDocumentInput(
    roomId: string,
    input: string,
    response: string
  ) {
    const redisDocumentResponse = new RedisChatMessageHistory({
      sessionId: roomId,
      client: this.cacheClient,
      sessionTTL: this.appConfigService.getAiAppConfig().defaultChatContextTTL,
    });
    await redisDocumentResponse.addUserMessage(input);
    await redisDocumentResponse.addAIChatMessage(response);
    this.memoryMap.set(
      roomId,
      new BufferMemory({
        returnMessages: true,
        memoryKey: 'history',
        chatHistory: redisDocumentResponse,
      })
    );
  }
}
