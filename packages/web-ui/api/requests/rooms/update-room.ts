import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { UpdateRoomSettingsRequestDto } from '@/contract/rooms/update-room-settings.request.dto.d';

export const updateRoom = async (
  roomId: string,
  values: UpdateRoomSettingsRequestDto,
  sessionId: string | null,
  jwtToken: string | null
) => {
  return new Promise<RoomResponseDto>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.rooms.updateRoom(roomId),
      options: { method: 'PATCH', body: JSON.stringify(values) },
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
