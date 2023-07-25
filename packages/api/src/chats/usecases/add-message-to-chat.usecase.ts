import { ChatsRepository } from '@/chats/chats.repository';
import { AddMessageToChatRequestDto } from '@/chats/dtos/add-message-to-chat.request.dto';
import { ChatMessageResponseDto } from '@/chats/dtos/chat-message.response.dto';
import { ChatMessageMustHaveSenderException } from '@/chats/exceptions/chat-message-must-have-sender.exception';
import { ChatNotFoundException } from '@/chats/exceptions/chat-not-found.exception';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { ChatMessageResponseSchema } from '@/contract/chats/chat-message.response.dto';
import { Injectable } from '@nestjs/common';

const TOKENS_LIMIT = 3000;

@Injectable()
export class AddMessageToChatUsecase implements Usecase {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async execute(
    roomId: string,
    addMessageToChatRequestDto: AddMessageToChatRequestDto,
    userId?: string
  ): Promise<{ message: ChatMessageResponseDto; shouldSummarize: boolean }> {
    const existingChat = await this.chatsRepository.findChatByRoomId(roomId);
    if (!existingChat) {
      throw new ChatNotFoundException();
    }

    if (!addMessageToChatRequestDto.sender.isAi && !userId) {
      throw new ChatMessageMustHaveSenderException();
    }

    const numberOfTokens = existingChat.messageHistory.reduce(
      (acc, curr) => (acc += curr.meta.tokens),
      0
    );

    try {
      const chatMessage = await this.chatsRepository.addMessageToChat(
        existingChat,
        addMessageToChatRequestDto,
        userId
      );

      return {
        message: ChatMessageResponseSchema.parse(chatMessage),
        shouldSummarize: numberOfTokens > TOKENS_LIMIT,
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
