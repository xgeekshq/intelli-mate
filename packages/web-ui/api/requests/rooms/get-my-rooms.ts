import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';

export const GET_MY_ROOMS_REQ_KEY = 'my-rooms';

export const getMyRooms = async (jwtToken: string | null) => {
  return new Promise<RoomResponseDto[]>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.rooms.getMyRooms(),
      options: { method: 'GET' },
      jwtToken,
    });

    if (!res.ok) {
      const { error } = JSON.parse(await res.text());
      return reject(error);
    }

    resolve(await res.json());
  });
};
