import { SocketMessageResponseDto } from '@/contract/chats/socket-message.response.dto';

interface CreateSocketMessageResponseFactoryType {
  id: string;
  response: string;
  isAi: boolean;
  createdAt: string;
  userId?: string;
}
export const createSocketMessageResponseFactory = ({
  id,
  response,
  isAi,
  createdAt,
  userId,
}: CreateSocketMessageResponseFactoryType): SocketMessageResponseDto => {
  return {
    id,
    response,
    isAi,
    createdAt,
    userId,
  };
};
