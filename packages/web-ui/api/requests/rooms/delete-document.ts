import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { ChatResponseDto } from '@/contract/chats/chat.response.dto.d';
import { RemoveDocumentFromChatRequestDto } from '@/contract/chats/remove-document-from-chat.request.dto.d';

export const deleteDocument = async (
  roomId: string,
  values: RemoveDocumentFromChatRequestDto,
  sessionId: string | null,
  jwtToken: string | null
) => {
  return new Promise<ChatResponseDto>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.chats.deleteDocument(roomId),
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
