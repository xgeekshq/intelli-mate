import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { RoomResponseSchema } from '@/contract/rooms/room.response.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { UpdateRoomSettingsRequestDto } from '@/rooms/dtos/update-room-settings.request.dto';
import { DuplicateRoomNameException } from '@/rooms/exceptions/duplicate-room-name.exception';
import { NoRoomSettingsDefinedException } from '@/rooms/exceptions/no-room-settings-defined.exception';
import { NotRoomOwnerException } from '@/rooms/exceptions/not-room-owner.exception';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateRoomSettingsUsecase implements Usecase {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async execute(
    userId: string,
    roomId: string,
    updateRoomSettingsRequestDto: UpdateRoomSettingsRequestDto
  ): Promise<RoomResponseDto> {
    const existingRoom = await this.roomsRepository.findRoom(roomId);
    if (existingRoom.ownerId !== userId) {
      throw new NotRoomOwnerException();
    }

    if (!Object.keys(updateRoomSettingsRequestDto).length) {
      throw new NoRoomSettingsDefinedException();
    }

    try {
      const room = await this.roomsRepository.updateRoomSettings(
        updateRoomSettingsRequestDto,
        existingRoom
      );
      return RoomResponseSchema.parse(room);
    } catch (e) {
      if (e.message.includes('duplicate')) {
        throw new DuplicateRoomNameException();
      }
      throw new InternalServerErrorException(e.message);
    }
  }
}
