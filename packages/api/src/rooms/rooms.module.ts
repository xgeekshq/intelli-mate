import { AuthModule } from '@/auth/auth.module';
import { ClerkAuthGuard } from '@/auth/guards/clerk.auth.guard';
import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';

import { RoomsController } from './rooms.controller';
import { roomsProviders } from './rooms.providers';
import { CreateRoomUsecase } from './usecases/create-room.usecase';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [RoomsController],
  providers: [CreateRoomUsecase, ClerkAuthGuard, ...roomsProviders],
})
export class RoomsModule {}
