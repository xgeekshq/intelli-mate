import { JoinChatUsecase } from '@/chats/usecases/join-chat.usecase';
import { IntelliMateEventHandler } from '@/common/events/intelli-mate.event-handler';
import {
  UserCreatedRoomEvent,
  UserCreatedRoomEventKey,
} from '@/common/events/user-created-room.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OnCreateRoomEventHandler implements IntelliMateEventHandler {
  constructor(private readonly joinChatUsecase: JoinChatUsecase) {}

  @OnEvent(UserCreatedRoomEventKey, { async: true })
  async handleEvent(event: UserCreatedRoomEvent): Promise<void> {
    await this.joinChatUsecase.execute(event.payload.userId, {
      roomId: event.payload.roomId,
    });
  }
}
