import { CreateChatForRoomRequestDto } from '@/chats/dtos/create-chat-for-room.request.dto';
import { DB_CHAT_MODEL_KEY } from '@/common/constants/models/chat';
import { Chat } from '@/common/types/chat';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class ChatsRepository {
  constructor(
    @Inject(DB_CHAT_MODEL_KEY)
    private chatModel: Model<Chat>
  ) {}

  findChatByRoomId(roomId: string): Promise<Chat> {
    return this.chatModel.findOne({ roomId });
  }

  async createChatForRoom(
    createChatForRoomRequestDto: CreateChatForRoomRequestDto
  ): Promise<Chat> {
    const chat = new this.chatModel({
      roomId: createChatForRoomRequestDto.roomId,
      participantIds: [],
      messageHistory: [],
    });
    await chat.save();
    return chat;
  }
}
