import { AiService } from '@/ai/services/ai.service';
import { ChainService } from '@/ai/services/chain.service';
import { MemoryService } from '@/ai/services/memory.service';
import { CacheModule } from '@/cache/cache.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CacheModule],
  providers: [AiService, MemoryService, ChainService],
  exports: [AiService],
})
export class AiModule {}
