import {
  UserCreatedRoomEventKey,
  createUserCreatedRoomEventFactory,
} from '@/common/events/user-created-room.event';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { RoomResponseSchema } from '@/contract/rooms/room.response.dto';
import { CreateRoomRequestDto } from '@/rooms/dtos/create-room.request.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { DuplicateRoomNameException } from '@/rooms/exceptions/duplicate-room-name.exception';
import { OwnerMustBeLoggedException } from '@/rooms/exceptions/owner-must-be-logged.exception';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CreateRoomUsecase implements Usecase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly roomsRepository: RoomsRepository
  ) {}

  async execute(
    userId: string,
    createRoomRequestDto: CreateRoomRequestDto
  ): Promise<RoomResponseDto> {
    if (createRoomRequestDto.ownerId !== userId) {
      throw new OwnerMustBeLoggedException();
    }

    try {
      const room = await this.roomsRepository.createRoom(createRoomRequestDto);

      this.eventEmitter.emit(
        UserCreatedRoomEventKey,
        createUserCreatedRoomEventFactory(room.id, userId)
      );

      return RoomResponseSchema.parse(room);
    } catch (e) {
      if (e.message.includes('duplicate')) {
        throw new DuplicateRoomNameException();
      }
      throw new InternalServerErrorException(e.message);
    }
  }
}
