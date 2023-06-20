import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { RoomResponseSchema } from '@/contract/rooms/room.response.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { RoomNotFoundException } from '@/rooms/exceptions/room-not-found.exception';
import { UserNotRoomMemberException } from '@/rooms/exceptions/user-not-room-member.exception';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindRoomByNameUsecase implements Usecase {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async execute(roomName: string, userId: string): Promise<RoomResponseDto> {
    const room = await this.roomsRepository.findRoomByName(roomName);

    if (!room) {
      throw new RoomNotFoundException();
    }
    if (!room.members.includes(userId)) {
      throw new UserNotRoomMemberException();
    }
    try {
      return RoomResponseSchema.parse(room);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
