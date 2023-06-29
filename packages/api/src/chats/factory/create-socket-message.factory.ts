import { SocketMessageResponseDto } from '@/contract/chats/socket-message.response.dto';

export const createSocketMessageResponseFactory = (
  id: string,
  response: string,
  isAi: boolean,
  userId?: string
): SocketMessageResponseDto => {
  return {
    id,
    response,
    isAi,
    userId,
  };
};
