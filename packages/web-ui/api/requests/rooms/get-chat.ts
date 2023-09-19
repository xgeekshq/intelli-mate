import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { ChatResponseDto } from '@/contract/chats/chat.response.dto.d';

export const GET_CHAT_REQ_KEY = 'chat';

export const getChat = async (roomId: string, jwtToken: string | null) => {
  return new Promise<ChatResponseDto>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.chats.getChat(roomId),
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
