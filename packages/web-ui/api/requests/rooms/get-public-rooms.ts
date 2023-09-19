import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';

export const GET_PUBLIC_ROOMS_REQ_KEY = 'public-rooms';

export const getPublicRooms = async (jwtToken: string | null) => {
  return new Promise<RoomResponseDto[]>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.rooms.getPublicRooms(),
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
