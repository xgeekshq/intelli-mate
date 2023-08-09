import { AiService } from '@/ai/facades/ai.service';
import { ChatsRepository } from '@/chats/chats.repository';
import { ChatResponseDto } from '@/chats/dtos/chat.response.dto';
import { RemoveDocumentFromChatRequestDto } from '@/chats/dtos/remove-document-from-chat.request.dto';
import { DocumentNotFoundException } from '@/chats/exceptions/document-not-found.exception';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { ChatResponseSchema } from '@/contract/chats/chat.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveDocumentFromChatUsecase implements Usecase {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly aiService: AiService
  ) {}

  async execute(
    userId: string,
    roomId: string,
    removeDocumentFromChatRequestDto: RemoveDocumentFromChatRequestDto
  ): Promise<ChatResponseDto> {
    const existingChat = await this.chatsRepository.findChatByRoomId(roomId);

    if (
      !existingChat.documents.find(
        (document) =>
          document.meta.filename === removeDocumentFromChatRequestDto.filename
      )
    ) {
      throw new DocumentNotFoundException();
    }

    try {
      const chat = await this.chatsRepository.removeDocumentFromChat(
        existingChat,
        removeDocumentFromChatRequestDto
      );

      await this.aiService.removeVectorDBCollection(
        roomId,
        removeDocumentFromChatRequestDto.filename
      );

      return ChatResponseSchema.parse(chat);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
