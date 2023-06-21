import { JoinRoomRequestSchema } from '@/contract/rooms/join-room.request.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class JoinRoomRequestDto extends createZodDto(JoinRoomRequestSchema) {}
