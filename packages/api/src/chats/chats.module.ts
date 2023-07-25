import { AiModule } from '@/ai/ai.module';
import { AuthModule } from '@/auth/auth.module';
import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ChatSocketGateway } from '@/chats/chat-socket.gateway';
import { ChatsController } from '@/chats/chats.controller';
import { chatsMongooseProviders } from '@/chats/chats.mongoose.providers';
import { ChatsRepository } from '@/chats/chats.repository';
import { OnCreateRoomEventHandler } from '@/chats/event-handlers/on-create-room.event-handler';
import { OnJoinRoomEventHandler } from '@/chats/event-handlers/on-join-room.event-handler';
import { AddMessageToChatUsecase } from '@/chats/usecases/add-message-to-chat.usecase';
import { FindChatByRoomIdUsecase } from '@/chats/usecases/find-chat-by-room-id.usecase';
import { FindChatMessageHistoryByRoomIdUsecase } from '@/chats/usecases/find-chat-message-history-by-room-id.usecase';
import { JoinChatUsecase } from '@/chats/usecases/join-chat.usecase';
import { UploadDocumentsToChatUsecase } from '@/chats/usecases/upload-documents-to-chat.usecase';
import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, AuthModule, AiModule],
  controllers: [ChatsController],
  providers: [
    // Guards
    ClerkAuthGuard,
    // DB Providers
    ...chatsMongooseProviders,
    // Services
    ChatsRepository,
    ChatSocketGateway,
    // Usecases
    JoinChatUsecase,
    FindChatByRoomIdUsecase,
    FindChatMessageHistoryByRoomIdUsecase,
    AddMessageToChatUsecase,
    UploadDocumentsToChatUsecase,
    // Event handlers
    OnJoinRoomEventHandler,
    OnCreateRoomEventHandler,
  ],
})
export class ChatsModule {}
