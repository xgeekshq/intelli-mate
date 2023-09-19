import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';

export const GET_ROOM_REQ_KEY = 'room';

export const getRoom = async (roomId: string, jwtToken: string | null) => {
  return new Promise<RoomResponseDto>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.rooms.getRoomById(roomId),
      options: { method: 'GET', cache: 'no-store' },
      jwtToken,
    });

    if (!res.ok) {
      const { error } = JSON.parse(await res.text());
      return reject(error);
    }

    resolve(await res.json());
  });
};
