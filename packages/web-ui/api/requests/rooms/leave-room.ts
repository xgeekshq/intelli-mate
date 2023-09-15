import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { LeaveRoomRequestDto } from '@/contract/rooms/leave-room.request.dto.d';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';

export const leaveRoom = async (
  values: LeaveRoomRequestDto,
  sessionId: string | null,
  jwtToken: string | null
) => {
  return new Promise<RoomResponseDto>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.rooms.leaveRoom(),
      options: { method: 'POST', body: JSON.stringify(values) },
      sessionId,
      jwtToken,
    });

    if (!res.ok) {
      const { error } = JSON.parse(await res.text());
      return reject(error);
    }

    resolve(await res.json());
  });
};
