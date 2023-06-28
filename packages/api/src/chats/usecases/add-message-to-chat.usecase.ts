import { ChatsRepository } from '@/chats/chats.repository';
import { AddMessageToChatRequestDto } from '@/chats/dtos/add-message-to-chat.request.dto';
import { ChatMessageResponseDto } from '@/chats/dtos/chat-message.response.dto';
import { ChatMessageMustHaveSenderException } from '@/chats/exceptions/chat-message-must-have-sender.exception';
import { ChatNotFoundException } from '@/chats/exceptions/chat-not-found.exception';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { ChatMessageResponseSchema } from '@/contract/chats/chat-message.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AddMessageToChatUsecase implements Usecase {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async execute(
    roomId: string,
    addMessageToChatRequestDto: AddMessageToChatRequestDto,
    userId?: string
  ): Promise<ChatMessageResponseDto> {
    const existingChat = await this.chatsRepository.findChatByRoomId(roomId);
    if (!existingChat) {
      throw new ChatNotFoundException();
    }

    if (!addMessageToChatRequestDto.sender.isAi && !userId) {
      throw new ChatMessageMustHaveSenderException();
    }

    try {
      const chatMessage = await this.chatsRepository.addMessageToChat(
        existingChat,
        addMessageToChatRequestDto,
        userId
      );
      return ChatMessageResponseSchema.parse(chatMessage);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
