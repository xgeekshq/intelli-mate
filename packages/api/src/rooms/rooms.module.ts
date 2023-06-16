import { AuthModule } from '@/auth/auth.module';
import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { DatabaseModule } from '@/database/database.module';
import { RoomsController } from '@/rooms/rooms.controller';
import { roomsMongooseProviders } from '@/rooms/rooms.mongoose.providers';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { CreateRoomUsecase } from '@/rooms/usecases/create-room.usecase';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [RoomsController],
  providers: [
    // Guards
    ClerkAuthGuard,
    // DB Providers
    ...roomsMongooseProviders,
    // Services
    RoomsRepository,
    CreateRoomUsecase,
  ],
})
export class RoomsModule {}
