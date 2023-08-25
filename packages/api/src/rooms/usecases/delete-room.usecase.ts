import {
  UserDeletedRoomEventKey,
  createUserDeletedRoomEventFactory,
} from '@/common/events/user-deleted-room.event';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { NotRoomOwnerException } from '@/rooms/exceptions/not-room-owner.exception';
import { RoomMustBeEmptyToDeleteException } from '@/rooms/exceptions/room-must-be-empty-to-delete.exception';
import { RoomNotFoundException } from '@/rooms/exceptions/room-not-found.exception';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DeleteRoomUsecase implements Usecase {
  constructor(
    private readonly roomsRepository: RoomsRepository,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute(userId: string, roomId: string): Promise<void> {
    const room = await this.roomsRepository.findRoom(roomId);

    if (!room) {
      throw new RoomNotFoundException();
    }

    const isOwner = room.ownerId === userId;
    if (!isOwner) {
      throw new NotRoomOwnerException();
    }

    if (room.members.length > 1) {
      throw new RoomMustBeEmptyToDeleteException();
    }

    try {
      await this.roomsRepository.deleteRoom(roomId);

      this.eventEmitter.emit(
        UserDeletedRoomEventKey,
        createUserDeletedRoomEventFactory(room.id, userId)
      );
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
