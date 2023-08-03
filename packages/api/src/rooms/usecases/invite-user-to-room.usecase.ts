import { ClerkAuthUserProvider } from '@/auth/providers/clerk/clerk-auth-user.provider';
import {
  UserJoinedRoomEventKey,
  createUserJoinedRoomEventFactory,
} from '@/common/events/user-joined-room.event';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { UserNotFoundException } from '@/common/exceptions/user-not-found.exception';
import { Usecase } from '@/common/types/usecase';
import { RoomResponseSchema } from '@/contract/rooms/room.response.dto';
import { InviteUserToRoomRequestDto } from '@/rooms/dtos/invite-user-to-room.request.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { RoomNotFoundException } from '@/rooms/exceptions/room-not-found.exception';
import { UserAlreadyInRoomException } from '@/rooms/exceptions/user-already-in-room.exception';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class InviteUserToRoomUsecase implements Usecase {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly roomsRepository: RoomsRepository,
    private readonly clerkAuthUserProvider: ClerkAuthUserProvider
  ) {}

  async execute(
    userId: string,
    inviteUserToRoomRequestDto: InviteUserToRoomRequestDto
  ): Promise<RoomResponseDto> {
    const user = await this.clerkAuthUserProvider.findUser(
      inviteUserToRoomRequestDto.userId
    );
    if (!user) {
      throw new UserNotFoundException();
    }

    const existingRoom = await this.roomsRepository.findRoom(
      inviteUserToRoomRequestDto.roomId
    );
    if (!existingRoom) {
      throw new RoomNotFoundException();
    }
    if (existingRoom.members.includes(inviteUserToRoomRequestDto.userId)) {
      throw new UserAlreadyInRoomException();
    }

    try {
      const room = await this.roomsRepository.inviteUserToRoom(
        user.id,
        existingRoom
      );

      this.eventEmitter.emit(
        UserJoinedRoomEventKey,
        createUserJoinedRoomEventFactory(room.id, user.id)
      );

      return RoomResponseSchema.parse(room);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
