import { ClerkAuthUserProvider } from '@/auth/providers/clerk/clerk-auth-user.provider';
import { ChatsRepository } from '@/chats/chats.repository';
import { ChatNotFoundException } from '@/chats/exceptions/chat-not-found.exception';
import { DocumentPermissionsMismatchException } from '@/chats/exceptions/document-permissions-mismatch.exception';
import { MaxDocumentSizeLimitException } from '@/chats/exceptions/max-document-size-limit.exception';
import { NoMoreDocumentsCanBeUploadedToChatException } from '@/chats/exceptions/no-more-documents-can-be-uploaded-to-chat.exception';
import { ACCEPTED_FILE_SIZE_LIMIT } from '@/common/constants/files';
import { CHAT_DOCUMENT_UPLOAD_QUEUE } from '@/common/constants/queues';
import { createChatDocUploadJobFactory } from '@/common/jobs/chat-doc-upload.job';
import { Chat } from '@/common/types/chat';
import { Usecase } from '@/common/types/usecase';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class UploadDocumentsToChatUsecase implements Usecase {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly clerkAuthUserProvider: ClerkAuthUserProvider,
    @InjectQueue(CHAT_DOCUMENT_UPLOAD_QUEUE)
    private readonly chatDocUploadQueue: Queue
  ) {}

  async execute(
    roomId: string,
    files: Express.Multer.File[],
    fileRoles: string[]
  ): Promise<void> {
    const existingChat = await this.chatsRepository.findChatByRoomId(roomId);

    if (!existingChat) {
      throw new ChatNotFoundException();
    }

    this.checkMaxDocumentsPerRoomInvariant(existingChat, files);

    this.checkMaxDocumentsSizePerRoomInvariant(existingChat, files);

    await this.checkDocumentRolesMatchUserRolesInvariant(
      existingChat,
      fileRoles
    );

    await this.chatsRepository.addDocumentsToChat(
      existingChat,
      files,
      fileRoles
    );

    for (const file of files) {
      await this.chatDocUploadQueue.add(
        createChatDocUploadJobFactory(roomId, file.originalname)
      );
    }
  }

  private checkMaxDocumentsPerRoomInvariant(
    chat: Chat,
    files: Express.Multer.File[]
  ) {
    if (
      chat.documents.length >= 2 ||
      files.length + chat.documents.length >= 2
    ) {
      throw new NoMoreDocumentsCanBeUploadedToChatException();
    }
  }

  private checkMaxDocumentsSizePerRoomInvariant(
    chat: Chat,
    files: Express.Multer.File[]
  ) {
    const existingDocumentsSize = chat.documents.reduce(
      (acc, document) => (acc += document.meta.size),
      0
    );

    const totalDocumentsSize = files.reduce(
      (acc, file) => (acc += file.size),
      existingDocumentsSize
    );

    if (totalDocumentsSize >= ACCEPTED_FILE_SIZE_LIMIT) {
      throw new MaxDocumentSizeLimitException();
    }
  }

  private async checkDocumentRolesMatchUserRolesInvariant(
    chat: Chat,
    fileRoles: string[]
  ) {
    const allParticipants = await this.clerkAuthUserProvider.findUsers(
      chat.participantIds
    );
    const rolesMatch = allParticipants.every((participant) =>
      participant.roles.sort().join(',').includes(fileRoles.sort().join(','))
    );

    if (!rolesMatch) {
      throw new DocumentPermissionsMismatchException();
    }
  }
}
