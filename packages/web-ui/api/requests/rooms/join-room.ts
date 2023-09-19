import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { JoinRoomRequestDto } from '@/contract/rooms/join-room.request.dto.d';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';

export const joinRoom = async (
  values: JoinRoomRequestDto,
  jwtToken: string | null
) => {
  return new Promise<RoomResponseDto>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.rooms.joinRoom(),
      options: { method: 'POST', body: JSON.stringify(values) },
      jwtToken,
    });

    if (!res.ok) {
      const { error } = JSON.parse(await res.text());
      return reject(error);
    }

    resolve(await res.json());
  });
};
