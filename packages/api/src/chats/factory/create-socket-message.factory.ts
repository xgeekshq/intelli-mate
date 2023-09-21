import { SourceMeta } from '@/common/types/chat';
import { SocketMessageResponseDto } from '@/contract/chats/socket-message.response.dto';

interface CreateSocketMessageResponseFactoryType {
  id: string;
  response: string;
  isAi: boolean;
  createdAt: string;
  userId?: string;
  source?: SourceMeta;
}
export const createSocketMessageResponseFactory = ({
  id,
  response,
  isAi,
  createdAt,
  userId,
  source,
}: CreateSocketMessageResponseFactoryType): SocketMessageResponseDto => {
  return {
    id,
    response,
    isAi,
    createdAt,
    userId,
    source,
  };
};
