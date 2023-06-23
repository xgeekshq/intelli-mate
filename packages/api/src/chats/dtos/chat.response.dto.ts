import { ChatResponseSchema } from '@/contract/chats/chat.response.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class ChatResponseDto extends createZodDto(ChatResponseSchema) {}
