import { JoinChatUsecase } from '@/chats/usecases/join-chat.usecase';
import { IntelliMateEventHandler } from '@/common/events/intelli-mate.event-handler';
import {
  UserJoinedRoomEvent,
  UserJoinedRoomEventKey,
} from '@/common/events/user-joined-room.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OnJoinRoomEventHandler implements IntelliMateEventHandler {
  constructor(private readonly joinChatUsecase: JoinChatUsecase) {}

  @OnEvent(UserJoinedRoomEventKey, { async: true })
  async handleEvent(event: UserJoinedRoomEvent): Promise<void> {
    await this.joinChatUsecase.execute(event.payload.userId, {
      roomId: event.payload.roomId,
    });
  }
}
