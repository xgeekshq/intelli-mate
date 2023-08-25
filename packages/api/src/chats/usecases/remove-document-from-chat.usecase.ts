import { readdir, rmdir, unlink } from 'fs';
import { AiService } from '@/ai/facades/ai.service';
import { ChatsRepository } from '@/chats/chats.repository';
import { ChatResponseDto } from '@/chats/dtos/chat.response.dto';
import { RemoveDocumentFromChatRequestDto } from '@/chats/dtos/remove-document-from-chat.request.dto';
import { DocumentNotFoundException } from '@/chats/exceptions/document-not-found.exception';
import { chatDocumentsFolder } from '@/common/constants/files';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { ChatResponseSchema } from '@/contract/chats/chat.response.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RemoveDocumentFromChatUsecase implements Usecase {
  private readonly logger = new Logger(RemoveDocumentFromChatUsecase.name);

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

      unlink(
        `${chatDocumentsFolder()}/${roomId}/${
          removeDocumentFromChatRequestDto.filename
        }`,
        (error) => {
          if (error) {
            this.logger.error(
              `Error removing file ${removeDocumentFromChatRequestDto.filename}. Error message: `,
              { error }
            );
            return;
          }
        }
      );

      readdir(`${chatDocumentsFolder()}/${roomId}`, (error, files) => {
        if (files.length === 0) {
          rmdir(`${chatDocumentsFolder()}/${roomId}`, (error) => {
            if (error) {
              this.logger.error(
                `Error removing directory ${chatDocumentsFolder()}/${roomId}. Error message: `,
                { error }
              );
            }
          });
        }
      });

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
