import { ChatMessageResponseSchema } from '@/contract/chats/chat-message.response.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class ChatMessageResponseDto extends createZodDto(
  ChatMessageResponseSchema
) {}
