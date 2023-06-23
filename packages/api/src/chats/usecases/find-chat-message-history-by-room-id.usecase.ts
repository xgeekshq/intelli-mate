import { ChatsRepository } from '@/chats/chats.repository';
import { ChatMessageResponseDto } from '@/chats/dtos/chat-message.response.dto';
import { ChatNotFoundException } from '@/chats/exceptions/chat-not-found.exception';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { ChatMessageResponseSchema } from '@/contract/chats/chat-message.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindChatMessageHistoryByRoomIdUsecase implements Usecase {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async execute(
    userId: string,
    roomId: string
  ): Promise<ChatMessageResponseDto[]> {
    const chat = await this.chatsRepository.findChatByRoomId(roomId);

    if (!chat) {
      throw new ChatNotFoundException();
    }

    try {
      return chat.messageHistory.map((message) =>
        ChatMessageResponseSchema.parse(message)
      );
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
