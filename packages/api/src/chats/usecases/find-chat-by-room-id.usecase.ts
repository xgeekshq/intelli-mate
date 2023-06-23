import { ChatsRepository } from '@/chats/chats.repository';
import { ChatResponseDto } from '@/chats/dtos/chat.response.dto';
import { ChatNotFoundException } from '@/chats/exceptions/chat-not-found.exception';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { ChatResponseSchema } from '@/contract/chats/chat.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindChatByRoomIdUsecase implements Usecase {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async execute(userId: string, roomId: string): Promise<ChatResponseDto> {
    const chat = await this.chatsRepository.findChatByRoomId(roomId);

    if (!chat) {
      throw new ChatNotFoundException();
    }

    try {
      return ChatResponseSchema.parse(chat);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
