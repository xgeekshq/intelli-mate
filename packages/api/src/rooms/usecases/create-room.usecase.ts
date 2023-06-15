import { Usecase } from '@/common/types/usecase';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { CreateRoomRequestDto } from '@/types/rooms/create-room.request.dto';
import { CreateRoomResponseSchema } from '@/types/rooms/create-room.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateRoomUsecase implements Usecase {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async execute(
    userId: string,
    createRoomRequestDto: CreateRoomRequestDto
  ): Promise<CreateRoomRequestDto> {
    try {
      const room = await this.roomsRepository.create(createRoomRequestDto);
      return CreateRoomResponseSchema.parse(room);
    } catch (e) {}
  }
}
