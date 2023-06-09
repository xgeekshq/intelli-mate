import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { RoomResponseSchema } from '@/contract/rooms/room.response.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { RoomNotFoundException } from '@/rooms/exceptions/room-not-found.exception';
import { UserNotRoomMemberException } from '@/rooms/exceptions/user-not-room-member.exception';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindRoomUsecase implements Usecase {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async execute(userId: string, roomName: string): Promise<RoomResponseDto> {
    const room = await this.roomsRepository.findRoom(roomName);

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
