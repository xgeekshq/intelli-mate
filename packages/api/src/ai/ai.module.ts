import { AiService } from '@/ai/services/ai.service';
import { ChainService } from '@/ai/services/chain.service';
import { MemoryService } from '@/ai/services/memory.service';
import { RedisKeepAliveService } from '@/ai/services/redis-keep-alive.service';
import { AppConfigModule } from '@/app-config/app-config.module';
import { CacheModule } from '@/cache/cache.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [CacheModule, AppConfigModule, ScheduleModule.forRoot()],
  providers: [AiService, MemoryService, ChainService, RedisKeepAliveService],
  exports: [AiService],
})
export class AiModule {}
