import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { CreateRoomRequestDto } from '@/contract/rooms/create-room.request.dto.d';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';

export const createRoom = async (
  values: CreateRoomRequestDto,
  sessionId: string | null,
  jwtToken: string | null
) => {
  return new Promise<RoomResponseDto>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.rooms.createRoom(),
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
