import { AddMessageToChatRequestDto } from '@/chats/dtos/add-message-to-chat.request.dto';
import { CreateChatForRoomRequestDto } from '@/chats/dtos/create-chat-for-room.request.dto';
import { DB_CHAT_MODEL_KEY } from '@/common/constants/models/chat';
import { createChatMessageFactory } from '@/common/factories/create-chat-message.factory';
import { Chat, ChatMessage } from '@/common/types/chat';
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

  async addMessageToChat(
    chat: Chat,
    addMessageToChatRequestDto: AddMessageToChatRequestDto,
    userId?: string
  ): Promise<ChatMessage> {
    chat.messageHistory.push(
      createChatMessageFactory(addMessageToChatRequestDto, userId)
    );
    if (
      !addMessageToChatRequestDto.sender.isAi &&
      !chat.participantIds.find((id) => userId === id)
    ) {
      chat.participantIds.push(userId);
    }
    await chat.save();
    return chat.messageHistory.sort(this.messageDateSortAscPredicate).at(0);
  }

  private messageDateSortAscPredicate(a: ChatMessage, b: ChatMessage) {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }
}
