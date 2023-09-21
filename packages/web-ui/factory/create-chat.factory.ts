import { UserResponseDto } from '@/contract/auth/user.response.dto.d';
import { ChatMessageResponseDto } from '@/contract/chats/chat-message.response.dto.d';
import { SocketMessageRequestDto } from '@/contract/chats/socket-message.request.dto';
import { SocketMessageResponseDto } from '@/contract/chats/socket-message.response.dto';
import { v4 as uuidv4 } from 'uuid';

import { ChatMessageType, ChatUserType, SocketMessageType } from '@/types/chat';

export const createChatMessageFactory = (
  message: ChatMessageResponseDto,
  aiMessage?: ChatMessageResponseDto,
  user?: ChatUserType
): ChatMessageType => {
  return {
    id: message.id,
    content: message.content,
    response: aiMessage?.content,
    source: aiMessage?.meta?.source,
    createdAt: message.createdAt,
    user,
  };
};

export const createChatParticipantsFactory = (
  participants: UserResponseDto[] = []
): ChatUserType[] => {
  return participants.map((participant): ChatUserType => {
    return {
      userId: participant.id,
      imageUrl: participant.profileImageUrl,
      userName: participant.username,
      name:
        participant.firstName && participant.lastName
          ? `${participant.firstName} ${participant.lastName}`
          : null,
      email:
        participant.emailAddresses.find(
          (email) => participant.primaryEmailAddressId === email.id
        )?.emailAddress ?? '',
    };
  });
};

export const createSocketMessageRequestFactory = ({
  roomId,
  aiModelId,
  content,
  userId,
}: SocketMessageType): SocketMessageRequestDto => {
  return {
    id: uuidv4(),
    roomId,
    aiModelId,
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
        source: response.source,
        createdAt: message.createdAt,
        user: message.user,
      };
    }
    return message;
  });
};
