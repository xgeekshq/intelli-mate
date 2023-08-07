import { MemoryService } from '@/ai/services/memory.service';
import { AppConfigService } from '@/app-config/app-config.service';
import { ChatsRepository } from '@/chats/chats.repository';
import { AddMessageToChatRequestDto } from '@/chats/dtos/add-message-to-chat.request.dto';
import { ChatMessageResponseDto } from '@/chats/dtos/chat-message.response.dto';
import { ChatMessageMustHaveSenderException } from '@/chats/exceptions/chat-message-must-have-sender.exception';
import { ChatNotFoundException } from '@/chats/exceptions/chat-not-found.exception';
import { RedisChatMemoryNotFoundException } from '@/chats/exceptions/redis-chat-memory-not-found.exception';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { ChatMessageResponseSchema } from '@/contract/chats/chat-message.response.dto';
import { Injectable } from '@nestjs/common';
import { encode } from 'gpt-3-encoder';

@Injectable()
export class AddMessageToChatUsecase implements Usecase {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly appConfigService: AppConfigService,
    private readonly memoryService: MemoryService
  ) {}

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
    const redisChatMemory = await this.memoryService
      .getMemory(roomId)
      .chatHistory.getMessages();

    if (!redisChatMemory) {
      throw new RedisChatMemoryNotFoundException();
    }

    const numberOfTokensRedis = redisChatMemory.reduce((acc, curr) => {
      if (!curr.text) {
        return 0;
      }
      return (acc += encode(curr.text).length);
    }, 0);

    try {
      const chatMessage = await this.chatsRepository.addMessageToChat(
        existingChat,
        addMessageToChatRequestDto,
        userId
      );

      return {
        message: ChatMessageResponseSchema.parse(chatMessage),
        shouldSummarize:
          numberOfTokensRedis >
          this.appConfigService.getAiAppConfig()
            .defaultTokenLimitForSummarization,
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
