import { IntelliMateEvent } from '@/common/events/intelli-mate.event';

export const UserJoinedRoomEventKey = 'room.joined';

export interface UserJoinedRoomEvent extends IntelliMateEvent {
  payload: {
    roomId: string;
    userId: string;
  };
}

export function createUserJoinedRoomEventFactory(
  roomId: string,
  userId: string
): UserJoinedRoomEvent {
  return {
    createdAt: new Date().toISOString(),
    payload: {
      roomId,
      userId,
    },
  };
}
