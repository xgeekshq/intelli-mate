import { AuthModule } from '@/auth/auth.module';
import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { DatabaseModule } from '@/database/database.module';
import { RoomsController } from '@/rooms/rooms.controller';
import { roomsMongooseProviders } from '@/rooms/rooms.mongoose.providers';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { CreateRoomUsecase } from '@/rooms/usecases/create-room.usecase';
import { FindMyRoomsUsecase } from '@/rooms/usecases/find-my-rooms.usecase';
import { FindPublicRoomsUsecase } from '@/rooms/usecases/find-public-rooms.usecase';
import { FindRoomUsecase } from '@/rooms/usecases/find-room.usecase';
import { InviteUserToRoomUsecase } from '@/rooms/usecases/invite-user-to-room.usecase';
import { JoinRoomUsecase } from '@/rooms/usecases/join-room.usecase';
import { LeaveRoomUsecase } from '@/rooms/usecases/leave-room.usecase';
import { UpdateRoomSettingsUsecase } from '@/rooms/usecases/update-room-settings.usecase';
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
    FindPublicRoomsUsecase,
    FindMyRoomsUsecase,
    InviteUserToRoomUsecase,
    LeaveRoomUsecase,
    UpdateRoomSettingsUsecase,
    FindRoomUsecase,
    JoinRoomUsecase,
  ],
})
export class RoomsModule {}
