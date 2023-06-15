import { DB_ROOM_MODEL_KEY } from '@/common/constants/models/room';
import { Room } from '@/common/types/room';
import { CreateRoomRequestDto } from '@/types/rooms/create-room.request.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class RoomsRepository {
  constructor(
    @Inject(DB_ROOM_MODEL_KEY)
    private roomModel: Model<Room>
  ) {}

  async create(createRoomRequestDto: CreateRoomRequestDto): Promise<Room> {
    const room = new this.roomModel(createRoomRequestDto);
    room.members.push(createRoomRequestDto.owner);
    await room.save();
    return room;
  }
}
