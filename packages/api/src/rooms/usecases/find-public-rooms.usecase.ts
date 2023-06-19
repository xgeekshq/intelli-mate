import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { RoomResponseSchema } from '@/contract/rooms/room.response.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindPublicRoomsUsecase implements Usecase {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async execute(userId: string): Promise<RoomResponseDto[]> {
    try {
      const publicRooms = await this.roomsRepository.findAllPublicRooms();
      return publicRooms.map((room) => RoomResponseSchema.parse(room));
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
