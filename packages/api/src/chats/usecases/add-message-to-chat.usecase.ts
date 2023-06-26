import { ChatsRepository } from '@/chats/chats.repository';
import { AddMessageToChatRequestDto } from '@/chats/dtos/add-message-to-chat.request.dto';
import { ChatResponseDto } from '@/chats/dtos/chat.response.dto';
import { ChatMessageMustHaveSenderException } from '@/chats/exceptions/chat-message-must-have-sender.exception';
import { ChatNotFoundException } from '@/chats/exceptions/chat-not-found.exception';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { ChatResponseSchema } from '@/contract/chats/chat.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AddMessageToChatUsecase implements Usecase {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async execute(
    roomId: string,
    addMessageToChatRequestDto: AddMessageToChatRequestDto,
    userId?: string
  ): Promise<ChatResponseDto> {
    const existingChat = await this.chatsRepository.findChatByRoomId(roomId);
    if (!existingChat) {
      throw new ChatNotFoundException();
    }

    if (!addMessageToChatRequestDto.sender.isAi && !userId) {
      throw new ChatMessageMustHaveSenderException();
    }

    try {
      const chat = await this.chatsRepository.addMessageToChat(
        existingChat,
        addMessageToChatRequestDto,
        userId
      );
      return ChatResponseSchema.parse(chat);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
