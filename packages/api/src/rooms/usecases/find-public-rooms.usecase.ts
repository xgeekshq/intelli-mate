import { Usecase } from '@/common/types/usecase';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { RoomResponseSchema } from '@/types/rooms/room.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindPublicRoomsUsecase implements Usecase {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async execute(userId: string): Promise<RoomResponseDto[]> {
    try {
      const publicRooms = await this.roomsRepository.findAllPublicRooms();
      return publicRooms.map((room) => RoomResponseSchema.parse(room));
    } catch (e) {}
  }
}
