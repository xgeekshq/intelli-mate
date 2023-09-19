import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';

export const uploadDocuments = async (
  roomId: string,
  formData: FormData,
  jwtToken: string | null
) => {
  return new Promise<void>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.chats.uploadDocuments(roomId),
      options: {
        method: 'POST',
        body: formData,
      },
      jwtToken,
      isApplicationJson: false,
    });

    if (!res.ok) {
      const { error } = JSON.parse(await res.text());
      return reject(error);
    }

    resolve();
  });
};
