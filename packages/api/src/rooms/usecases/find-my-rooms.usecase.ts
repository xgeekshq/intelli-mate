import { Usecase } from '@/common/types/usecase';
import { RoomResponseSchema } from '@/contract/rooms/room.response.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindMyRoomsUsecase implements Usecase {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async execute(userId: string): Promise<RoomResponseDto[]> {
    try {
      const myRooms = await this.roomsRepository.findMyRooms(userId);
      return myRooms.map((room) => RoomResponseSchema.parse(room));
    } catch (e) {}
  }
}
