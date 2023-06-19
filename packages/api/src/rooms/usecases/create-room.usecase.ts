import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { RoomResponseSchema } from '@/contract/rooms/room.response.dto';
import { CreateRoomRequestDto } from '@/rooms/dtos/create-room.request.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { DuplicateRoomNameException } from '@/rooms/exceptions/duplicate-room-name.exception';
import { OwnerMustBeLoggedException } from '@/rooms/exceptions/owner-must-be-logged.exception';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateRoomUsecase implements Usecase {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async execute(
    userId: string,
    createRoomRequestDto: CreateRoomRequestDto
  ): Promise<RoomResponseDto> {
    if (createRoomRequestDto.owner !== userId) {
      throw new OwnerMustBeLoggedException();
    }

    try {
      const room = await this.roomsRepository.createRoom(createRoomRequestDto);
      return RoomResponseSchema.parse(room);
    } catch (e) {
      if (e.message.includes('duplicate')) {
        throw new DuplicateRoomNameException();
      }
      throw new InternalServerErrorException(e.message);
    }
  }
}
