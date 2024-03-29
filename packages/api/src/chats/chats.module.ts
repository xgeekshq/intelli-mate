import { AiModule } from '@/ai/ai.module';
import { MemoryService } from '@/ai/services/memory.service';
import { AppConfigModule } from '@/app-config/app-config.module';
import { AuthModule } from '@/auth/auth.module';
import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { CacheModule } from '@/cache/cache.module';
import { ChatSocketGateway } from '@/chats/chat-socket.gateway';
import { ChatsController } from '@/chats/chats.controller';
import { chatsMongooseProviders } from '@/chats/chats.mongoose.providers';
import { ChatsRepository } from '@/chats/chats.repository';
import { OnCreateRoomEventHandler } from '@/chats/event-handlers/on-create-room.event-handler';
import { OnDeleteRoomEventHandler } from '@/chats/event-handlers/on-delete-room.event-handler';
import { OnJoinRoomEventHandler } from '@/chats/event-handlers/on-join-room.event-handler';
import { AddMessagePairToHistoryJobConsumer } from '@/chats/job-consumers/add-message-pair-to-history.job-consumer';
import { TransformDocToVectorJobConsumer } from '@/chats/job-consumers/transform-doc-to-vector.job-consumer';
import { AddMessageToChatUsecase } from '@/chats/usecases/add-message-to-chat.usecase';
import { DeleteChatUsecase } from '@/chats/usecases/delete-chat.usecase';
import { FindChatByRoomIdUsecase } from '@/chats/usecases/find-chat-by-room-id.usecase';
import { FindChatMessageHistoryByRoomIdUsecase } from '@/chats/usecases/find-chat-message-history-by-room-id.usecase';
import { JoinChatUsecase } from '@/chats/usecases/join-chat.usecase';
import { RemoveDocumentFromChatUsecase } from '@/chats/usecases/remove-document-from-chat.usecase';
import { UploadDocumentsToChatUsecase } from '@/chats/usecases/upload-documents-to-chat.usecase';
import {
  CHAT_DOCUMENT_UPLOAD_QUEUE,
  CHAT_MESSAGE_HISTORY_QUEUE,
} from '@/common/constants/queues';
import { DatabaseModule } from '@/database/database.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    AiModule,
    AppConfigModule,
    BullModule.registerQueue({ name: CHAT_DOCUMENT_UPLOAD_QUEUE }),
    BullModule.registerQueue({ name: CHAT_MESSAGE_HISTORY_QUEUE }),
    CacheModule,
  ],
  controllers: [ChatsController],
  providers: [
    // Guards
    ClerkAuthGuard,
    // DB Providers
    ...chatsMongooseProviders,
    // Services
    MemoryService,
    ChatsRepository,
    ChatSocketGateway,
    // Usecases
    JoinChatUsecase,
    FindChatByRoomIdUsecase,
    FindChatMessageHistoryByRoomIdUsecase,
    AddMessageToChatUsecase,
    RemoveDocumentFromChatUsecase,
    UploadDocumentsToChatUsecase,
    DeleteChatUsecase,
    // Event handlers
    OnJoinRoomEventHandler,
    OnCreateRoomEventHandler,
    OnDeleteRoomEventHandler,
    // Job consumers
    TransformDocToVectorJobConsumer,
    AddMessagePairToHistoryJobConsumer,
  ],
})
export class ChatsModule {}
