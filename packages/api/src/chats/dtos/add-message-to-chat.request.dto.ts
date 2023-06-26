import { AddMessageToChatRequestSchema } from '@/contract/chats/add-message-to-chat.request.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class AddMessageToChatRequestDto extends createZodDto(
  AddMessageToChatRequestSchema
) {}
