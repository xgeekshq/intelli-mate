import { JoinChatUsecase } from '@/chats/usecases/join-chat.usecase';
import { IntelliMateEventHandler } from '@/common/events/intelli-mate.event-handler';
import {
  UserJoinedRoomEvent,
  UserJoinedRoomEventKey,
} from '@/common/events/user-joined-room.event';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OnJoinRoomEventHandler implements IntelliMateEventHandler {
  private readonly logger = new Logger(OnJoinRoomEventHandler.name);

  constructor(private readonly joinChatUsecase: JoinChatUsecase) {}

  @OnEvent(UserJoinedRoomEventKey, { async: true })
  async handleEvent(event: UserJoinedRoomEvent): Promise<void> {
    this.logger.log(
      `Starting event handler for ${UserJoinedRoomEventKey} event with payload: `,
      {
        payload: event.payload,
      }
    );

    await this.joinChatUsecase.execute(event.payload.userId, {
      roomId: event.payload.roomId,
    });

    this.logger.log(
      `Finished event handler for ${UserJoinedRoomEventKey} event`
    );
  }
}
