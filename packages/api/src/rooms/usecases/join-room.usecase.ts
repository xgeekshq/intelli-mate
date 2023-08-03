import {
  UserJoinedRoomEventKey,
  createUserJoinedRoomEventFactory,
} from '@/common/events/user-joined-room.event';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { RoomResponseSchema } from '@/contract/rooms/room.response.dto';
import { JoinRoomRequestDto } from '@/rooms/dtos/join-room.request.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { RoomIsPrivateException } from '@/rooms/exceptions/room-is-private.exception';
import { RoomNotFoundException } from '@/rooms/exceptions/room-not-found.exception';
import { UserAlreadyInRoomException } from '@/rooms/exceptions/user-already-in-room.exception';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class JoinRoomUsecase implements Usecase {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly roomsRepository: RoomsRepository
  ) {}

  async execute(
    userId: string,
    joinRoomRequestDto: JoinRoomRequestDto
  ): Promise<RoomResponseDto> {
    const existingRoom = await this.roomsRepository.findRoom(
      joinRoomRequestDto.roomId
    );
    if (!existingRoom) {
      throw new RoomNotFoundException();
    }
    if (existingRoom.members.includes(userId)) {
      throw new UserAlreadyInRoomException();
    }
    if (existingRoom.isPrivate) {
      throw new RoomIsPrivateException();
    }

    try {
      const room = await this.roomsRepository.joinRoom(userId, existingRoom);

      this.eventEmitter.emit(
        UserJoinedRoomEventKey,
        createUserJoinedRoomEventFactory(room.id, userId)
      );

      return RoomResponseSchema.parse(room);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
