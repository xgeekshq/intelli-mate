import { AuthModule } from '@/auth/auth.module';
import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ChatsController } from '@/chats/chats.controller';
import { chatsMongooseProviders } from '@/chats/chats.mongoose.providers';
import { ChatsRepository } from '@/chats/chats.repository';
import { FindChatByRoomIdUsecase } from '@/chats/usecases/find-chat-by-room-id.usecase';
import { FindChatMessageHistoryByRoomIdUsecase } from '@/chats/usecases/find-chat-message-history-by-room-id.usecase';
import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ChatsController],
  providers: [
    // Guards
    ClerkAuthGuard,
    // DB Providers
    ...chatsMongooseProviders,
    // Services
    ChatsRepository,
    FindChatByRoomIdUsecase,
    FindChatMessageHistoryByRoomIdUsecase,
  ],
})
export class ChatsModule {}
