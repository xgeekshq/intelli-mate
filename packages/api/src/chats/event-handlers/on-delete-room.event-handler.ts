import { AiService } from '@/ai/facades/ai.service';
import { ChatsRepository } from '@/chats/chats.repository';
import { DeleteChatUsecase } from '@/chats/usecases/delete-chat.usecase';
import { RemoveDocumentFromChatUsecase } from '@/chats/usecases/remove-document-from-chat.usecase';
import { IntelliMateEventHandler } from '@/common/events/intelli-mate.event-handler';
import {
  UserDeletedRoomEvent,
  UserDeletedRoomEventKey,
} from '@/common/events/user-deleted-room.event';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OnDeleteRoomEventHandler implements IntelliMateEventHandler {
  private readonly logger = new Logger(OnDeleteRoomEventHandler.name);

  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly deleteChatUsecase: DeleteChatUsecase,
    private readonly removeDocumentFromChatUsecase: RemoveDocumentFromChatUsecase,
    private readonly aiService: AiService
  ) {}

  @OnEvent(UserDeletedRoomEventKey, { async: true })
  async handleEvent(event: UserDeletedRoomEvent): Promise<void> {
    this.logger.log(
      `Starting event handler for ${UserDeletedRoomEventKey} event with payload: `,
      {
        payload: event.payload,
      }
    );

    const chat = await this.chatsRepository.findChatByRoomId(
      event.payload.roomId
    );

    for (const document of chat.documents) {
      await this.removeDocumentFromChatUsecase.execute(
        event.payload.userId,
        event.payload.roomId,
        {
          filename: document.meta.filename,
        }
      );
    }

    await this.aiService.deleteChatHistoryMessages(event.payload.roomId);

    await this.deleteChatUsecase.execute(event.payload.roomId);

    this.logger.log(
      `Finished event handler for ${UserDeletedRoomEventKey} event`
    );
  }
}
