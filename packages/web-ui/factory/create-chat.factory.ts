import { UserResponseDto } from '@/contract/auth/user.response.dto.d';
import { ChatMessageResponseDto } from '@/contract/chats/chat-message.response.dto.d';
import { SocketMessageRequestDto } from '@/contract/chats/socket-message.request.dto';
import { SocketMessageResponseDto } from '@/contract/chats/socket-message.response.dto';
import { v4 as uuidv4 } from 'uuid';

import { ChatMessageType, ChatUserType } from '@/types/chat';

export const createChatMessageFactory = (
  message: ChatMessageResponseDto,
  aiMessage?: ChatMessageResponseDto,
  user?: ChatUserType
): ChatMessageType => {
  return {
    id: message.id,
    content: message.content,
    response: aiMessage?.content,
    user,
  };
};

export const createChatParticipantsFactory = (
  participants: UserResponseDto[]
): ChatUserType[] => {
  return participants.map((participant): ChatUserType => {
    return {
      userId: participant.id,
      imageUrl: participant.profileImageUrl,
      userName: participant.username,
    };
  });
};

export const createSocketMessageRequestFactory = (
  roomId: string,
  content: string,
  userId: string
): SocketMessageRequestDto => {
  return {
    id: uuidv4(),
    roomId,
    content,
    userId,
  };
};

export const createChatMessagesWithResponseFactory = (
  messages: ChatMessageType[],
  response: SocketMessageResponseDto
) => {
  return messages.map((message) => {
    if (message.id === response.id) {
      return {
        id: message.id,
        content: message.content,
        response: response.response,
        user: message.user,
      };
    }
    return message;
  });
};