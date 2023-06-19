import { CreateRoomRequestSchema } from '@/contract/rooms/create-room.request.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class CreateRoomRequestDto extends createZodDto(
  CreateRoomRequestSchema
) {}
