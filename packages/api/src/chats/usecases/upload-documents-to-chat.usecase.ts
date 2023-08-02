import { ClerkAuthUserProvider } from '@/auth/providers/clerk/clerk-auth-user.provider';
import { ChatsRepository } from '@/chats/chats.repository';
import { ChatNotFoundException } from '@/chats/exceptions/chat-not-found.exception';
import { DocumentPermissionsMismatchException } from '@/chats/exceptions/document-permissions-mismatch.exception';
import { MaxDocumentSizeLimitException } from '@/chats/exceptions/max-document-size-limit.exception';
import { NoMoreDocumentsCanBeUploadedToChatException } from '@/chats/exceptions/no-more-documents-can-be-uploaded-to-chat.exception';
import { ACCEPTED_FILE_SIZE_LIMIT } from '@/common/constants/files';
import { CHAT_DOCUMENT_UPLOAD_QUEUE } from '@/common/constants/queues';
import { createChatDocUploadJobFactory } from '@/common/jobs/chat-doc-upload.job';
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

    if (existingChat.documents.length >= 2) {
      throw new NoMoreDocumentsCanBeUploadedToChatException();
    }

    const existingDocumentsSize = existingChat.documents.reduce(
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

    const allParticipants = await this.clerkAuthUserProvider.findUsers(
      existingChat.participantIds
    );
    const rolesMatch = allParticipants.every((participant) =>
      participant.roles.sort().join(',').includes(fileRoles.sort().join(','))
    );

    if (!rolesMatch) {
      throw new DocumentPermissionsMismatchException();
    }

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
}
