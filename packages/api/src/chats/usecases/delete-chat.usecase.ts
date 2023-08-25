import { ChatsRepository } from '@/chats/chats.repository';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteChatUsecase implements Usecase {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async execute(roomId: string): Promise<void> {
    try {
      await this.chatsRepository.deleteChat(roomId);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
