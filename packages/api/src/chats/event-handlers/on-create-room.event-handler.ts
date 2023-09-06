import { JoinChatUsecase } from '@/chats/usecases/join-chat.usecase';
import { IntelliMateEventHandler } from '@/common/events/intelli-mate.event-handler';
import {
  UserCreatedRoomEvent,
  UserCreatedRoomEventKey,
} from '@/common/events/user-created-room.event';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OnCreateRoomEventHandler implements IntelliMateEventHandler {
  private readonly logger = new Logger(OnCreateRoomEventHandler.name);

  constructor(private readonly joinChatUsecase: JoinChatUsecase) {}

  @OnEvent(UserCreatedRoomEventKey, { async: true })
  async handleEvent(event: UserCreatedRoomEvent): Promise<void> {
    this.logger.log(
      `Starting event handler for ${UserCreatedRoomEventKey} event with payload: `,
      {
        payload: event.payload,
      }
    );
    await this.joinChatUsecase.execute(event.payload.userId, {
      roomId: event.payload.roomId,
      aiModelId: event.payload.aiModelId,
    });

    this.logger.log(
      `Finished event handler for ${UserCreatedRoomEventKey} event`
    );
  }
}
