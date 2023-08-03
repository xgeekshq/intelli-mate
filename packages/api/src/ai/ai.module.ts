import { AgentConversationService } from '@/ai/services/agent-conversation.service';
import { AiService } from '@/ai/services/ai.service';
import { MemoryService } from '@/ai/services/memory.service';
import { RedisKeepAliveService } from '@/ai/services/redis-keep-alive.service';
import { SimpleConversationChainService } from '@/ai/services/simple-conversation-chain.service';
import { ToolService } from '@/ai/services/tool.service';
import { AppConfigModule } from '@/app-config/app-config.module';
import { CacheModule } from '@/cache/cache.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [CacheModule, AppConfigModule, ScheduleModule.forRoot()],
  providers: [
    AiService,
    MemoryService,
    ToolService,
    SimpleConversationChainService,
    AgentConversationService,
    RedisKeepAliveService,
  ],
  exports: [AiService],
})
export class AiModule {}
