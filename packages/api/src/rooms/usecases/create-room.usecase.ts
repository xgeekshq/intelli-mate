import { DB_ROOM_MODEL_KEY } from '@/common/constants/models/room';
import { Room } from '@/common/types/room';
import { Usecase } from '@/common/types/usecase';
import { CreateRoomRequestDto } from '@/types/rooms/create-room.request.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class CreateRoomUsecase implements Usecase {
  constructor(
    @Inject(DB_ROOM_MODEL_KEY)
    private roomModel: Model<Room>
  ) {}

  execute(
    createRoomRequestDto: CreateRoomRequestDto
  ): Promise<CreateRoomRequestDto> {
    return null;
  }
}
