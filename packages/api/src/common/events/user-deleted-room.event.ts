import { IntelliMateEvent } from '@/common/events/intelli-mate.event';

export const UserDeletedRoomEventKey = 'room.deleted';

export interface UserDeletedRoomEvent extends IntelliMateEvent {
  payload: {
    roomId: string;
    userId: string;
  };
}

export function createUserDeletedRoomEventFactory(
  roomId: string,
  userId: string
): UserDeletedRoomEvent {
  return {
    createdAt: new Date().toISOString(),
    payload: {
      roomId,
      userId,
    },
  };
}
