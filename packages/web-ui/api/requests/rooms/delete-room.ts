import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';

export const deleteRoom = async (roomId: string, jwtToken: string | null) => {
  return new Promise<void>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.rooms.deleteRoom(roomId),
      options: { method: 'DELETE' },
      jwtToken,
    });

    if (!res.ok) {
      const { error } = JSON.parse(await res.text());
      return reject(error);
    }

    resolve();
  });
};
