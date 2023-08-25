import { DB_ROOM_MODEL_KEY } from '@/common/constants/models/room';
import { Room } from '@/common/types/room';
import { CreateRoomRequestDto } from '@/rooms/dtos/create-room.request.dto';
import { UpdateRoomSettingsRequestDto } from '@/rooms/dtos/update-room-settings.request.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class RoomsRepository {
  constructor(
    @Inject(DB_ROOM_MODEL_KEY)
    private roomModel: Model<Room>
  ) {}

  findAllPublicRooms(): Promise<Room[]> {
    return this.roomModel.find({ isPrivate: false });
  }

  findMyRooms(userId: string): Promise<Room[]> {
    return this.roomModel.find({ members: { $in: [userId] } });
  }

  findRoom(roomId: string): Promise<Room> {
    return this.roomModel.findById(roomId);
  }

  findRoomByName(roomName: string): Promise<Room> {
    return this.roomModel.findOne({ name: roomName });
  }

  async createRoom(createRoomRequestDto: CreateRoomRequestDto): Promise<Room> {
    const room = new this.roomModel(createRoomRequestDto);
    room.members.push(createRoomRequestDto.ownerId);
    await room.save();
    return room;
  }

  async deleteRoom(roomId: string): Promise<void> {
    await this.roomModel.deleteOne({ _id: roomId });
  }

  async inviteUserToRoom(userId: string, room: Room): Promise<Room> {
    room.members.push(userId);
    await room.save();
    return room;
  }

  async joinRoom(userId: string, room: Room): Promise<Room> {
    room.members.push(userId);
    await room.save();
    return room;
  }

  async leaveRoom(userId: string, room: Room): Promise<Room> {
    room.members = room.members.filter((user) => user !== userId);
    await room.save();
    return room;
  }

  async updateRoomSettings(
    updateRoomSettingsRequestDto: UpdateRoomSettingsRequestDto,
    room: Room
  ): Promise<Room> {
    if (updateRoomSettingsRequestDto.name !== undefined) {
      room.name = updateRoomSettingsRequestDto.name;
    }
    if (updateRoomSettingsRequestDto.isPrivate !== undefined) {
      room.isPrivate = updateRoomSettingsRequestDto.isPrivate;
    }
    await room.save();
    return room;
  }
}
