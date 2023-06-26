import { AddMessageToChatRequestDto } from '@/chats/dtos/add-message-to-chat.request.dto';
import { ChatMessage } from '@/common/types/chat';

export function createChatMessageFactory(
  addMessageToChatRequestDto: AddMessageToChatRequestDto,
  userId?: string
): Omit<ChatMessage, 'id'> {
  const { sender, content, meta } = addMessageToChatRequestDto;

  return {
    sender: {
      ...(userId ? { userId } : {}),
      isAi: sender.isAi,
    },
    content,
    meta: {
      tokens: meta.tokens,
      ...(meta.replyTo ? { replyTo: meta.replyTo } : {}),
      ...(meta.ai
        ? {
            ai: {
              llmModel: meta.ai.llmModel,
            },
          }
        : {}),
    },
    createdAt: new Date().toISOString(),
  };
}
