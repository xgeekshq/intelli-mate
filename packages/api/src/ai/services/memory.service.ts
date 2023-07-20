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

  getMemory(roomId: string): BufferMemory {
    if (!this.hasMemory(roomId)) {
      this.createMemory(roomId);
    }

    return this.memoryMap.get(roomId);
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
}
