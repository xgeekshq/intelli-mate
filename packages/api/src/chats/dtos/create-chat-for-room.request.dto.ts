import { CreateChatForRoomRequestSchema } from '@/contract/chats/create-chat-for-room.request.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class CreateChatForRoomRequestDto extends createZodDto(
  CreateChatForRoomRequestSchema
) {}
