import { ClerkAuthUserProvider } from '@/auth/providers/clerk/clerk-auth-user.provider';
import { ChatsRepository } from '@/chats/chats.repository';
import { ChatNotFoundException } from '@/chats/exceptions/chat-not-found.exception';
import { DocumentPermissionsMismatchException } from '@/chats/exceptions/document-permissions-mismatch.exception';
import { Usecase } from '@/common/types/usecase';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadDocumentsToChatUsecase implements Usecase {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly clerkAuthUserProvider: ClerkAuthUserProvider
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

    // TODO: add job to queue for AI document transformation
  }
}
