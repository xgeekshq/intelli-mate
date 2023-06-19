import { DB_ROOM_MODEL_KEY } from '@/common/constants/models/room';
import { Room } from '@/common/types/room';
import { CreateRoomRequestDto } from '@/rooms/dtos/create-room.request.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class RoomsRepository {
  constructor(
    @Inject(DB_ROOM_MODEL_KEY)
    private roomModel: Model<Room>
  ) {}

  async findAllPublicRooms(): Promise<Room[]> {
    return this.roomModel.find({ private: false });
  }

  async findMyRooms(userId: string): Promise<Room[]> {
    return this.roomModel.find({ members: { $in: [userId] } });
  }

  async createRoom(createRoomRequestDto: CreateRoomRequestDto): Promise<Room> {
    const room = new this.roomModel(createRoomRequestDto);
    room.members.push(createRoomRequestDto.owner);
    await room.save();
    return room;
  }

  async inviteUserToRoom(userId: string, roomId: string): Promise<Room> {
    const room = await this.roomModel.findById(roomId);
    room.members.push(userId);
    await room.save();
    return room;
  }
}
