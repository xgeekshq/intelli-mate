import { AiAdminController } from '@/ai/admin.controller';
import { aiModelsMongooseProviders } from '@/ai/ai-models.mongoose.providers';
import { AiModelsRepository } from '@/ai/ai-models.repository';
import { AiController } from '@/ai/ai.controller';
import { AiService } from '@/ai/facades/ai.service';
import { ChatModelService } from '@/ai/services/chat-model.service';
import { MemoryService } from '@/ai/services/memory.service';
import { RedisKeepAliveService } from '@/ai/services/redis-keep-alive.service';
import { SimpleConversationChainService } from '@/ai/services/simple-conversation-chain.service';
import { VectorDbService } from '@/ai/services/vector-db.service';
import { AdminAddAiModelUsecase } from '@/ai/usecases/admin-add-ai-model.usecase';
import { AdminFindAiModelsUsecase } from '@/ai/usecases/admin-find-ai-models.usecase';
import { FindAiModelUsecase } from '@/ai/usecases/find-ai-model.usecase';
import { FindAiModelsUsecase } from '@/ai/usecases/find-ai-models.usecase';
import { AppConfigModule } from '@/app-config/app-config.module';
import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { AdminValidateCredentialsUsecase } from '@/auth/usecases/admin-validate-credentials.usecase';
import { CacheModule } from '@/cache/cache.module';
import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    AppConfigModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AiAdminController, AiController],
  providers: [
    // Guards
    ClerkAuthGuard,
    // Publicly exposed facades
    AiService,
    // DB Providers
    ...aiModelsMongooseProviders,
    // Usecases
    AdminValidateCredentialsUsecase,
    AdminAddAiModelUsecase,
    AdminFindAiModelsUsecase,
    FindAiModelsUsecase,
    FindAiModelUsecase,
    // Private services
    AiModelsRepository,
    MemoryService,
    SimpleConversationChainService,
    RedisKeepAliveService,
    VectorDbService,
    ChatModelService,
  ],
  exports: [AiService],
})
export class AiModule {}
