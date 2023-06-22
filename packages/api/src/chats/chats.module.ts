import { AuthModule } from '@/auth/auth.module';
import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ChatsController } from '@/chats/chats.controller';
import { chatsMongooseProviders } from '@/chats/chats.mongoose.providers';
import { ChatsRepository } from '@/chats/chats.repository';
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
  ],
})
export class ChatsModule {}
