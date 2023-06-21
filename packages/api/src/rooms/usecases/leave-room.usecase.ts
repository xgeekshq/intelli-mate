import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { RoomResponseSchema } from '@/contract/rooms/room.response.dto';
import { LeaveRoomRequestDto } from '@/rooms/dtos/leave-room.request.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { OwnerCannotLeaveRoomException } from '@/rooms/exceptions/owner-cannot-leave-room.exception';
import { RoomNotFoundException } from '@/rooms/exceptions/room-not-found.exception';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaveRoomUsecase implements Usecase {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async execute(
    userId: string,
    leaveRoomRequestDto: LeaveRoomRequestDto
  ): Promise<RoomResponseDto> {
    const existingRoom = await this.roomsRepository.findRoom(
      leaveRoomRequestDto.roomId
    );
    if (!existingRoom) {
      throw new RoomNotFoundException();
    }

    if (existingRoom.ownerId === userId) {
      throw new OwnerCannotLeaveRoomException();
    }

    try {
      const room = await this.roomsRepository.leaveRoom(userId, existingRoom);
      return RoomResponseSchema.parse(room);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
