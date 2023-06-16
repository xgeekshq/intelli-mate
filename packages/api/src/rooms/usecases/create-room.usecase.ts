import { Usecase } from '@/common/types/usecase';
import { CreateRoomRequestDto } from '@/rooms/dtos/create-room.request.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { RoomResponseSchema } from '@/types/rooms/room.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateRoomUsecase implements Usecase {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async execute(
    userId: string,
    createRoomRequestDto: CreateRoomRequestDto
  ): Promise<RoomResponseDto> {
    try {
      const room = await this.roomsRepository.create(createRoomRequestDto);
      return RoomResponseSchema.parse(room);
    } catch (e) {}
  }
}
