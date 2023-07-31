import { ChatsRepository } from '@/chats/chats.repository';
import { ChatResponseDto } from '@/chats/dtos/chat.response.dto';
import { CreateChatForRoomRequestDto } from '@/chats/dtos/create-chat-for-room.request.dto';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { ChatResponseSchema } from '@/contract/chats/chat.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JoinChatUsecase implements Usecase {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async execute(
    userId: string,
    createChatForRoomRequestDto: CreateChatForRoomRequestDto
  ): Promise<ChatResponseDto> {
    const existingChat = await this.chatsRepository.findChatByRoomId(
      createChatForRoomRequestDto.roomId
    );

    if (existingChat) {
      await this.chatsRepository.addParticipantToChat(existingChat, userId);
      return ChatResponseSchema.parse(existingChat);
    }

    try {
      const chat = await this.chatsRepository.createChatForRoom(
        userId,
        createChatForRoomRequestDto
      );
      return ChatResponseSchema.parse(chat);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
