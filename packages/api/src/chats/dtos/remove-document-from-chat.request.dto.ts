import { RemoveDocumentFromChatRequestSchema } from '@/contract/chats/remove-document-from-chat.request.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class RemoveDocumentFromChatRequestDto extends createZodDto(
  RemoveDocumentFromChatRequestSchema
) {}
