import { DB_ROOM_MODEL_KEY } from '@/types/constants/models/room';
import { CreateRoomRequestDto } from '@/types/rooms/create-room.request.dto';
import { type Room } from '@/types/rooms/room';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Usecase } from '../../types/usecase';

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
