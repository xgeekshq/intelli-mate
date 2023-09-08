import { IntelliMateEvent } from '@/common/events/intelli-mate.event';

export const UserCreatedRoomEventKey = 'room.created';

export interface UserCreatedRoomEvent extends IntelliMateEvent {
  payload: {
    roomId: string;
    aiModelId: string;
    userId: string;
  };
}

export function createUserCreatedRoomEventFactory(
  roomId: string,
  aiModelId: string,
  userId: string
): UserCreatedRoomEvent {
  return {
    createdAt: new Date().toISOString(),
    payload: {
      roomId,
      aiModelId,
      userId,
    },
  };
}
