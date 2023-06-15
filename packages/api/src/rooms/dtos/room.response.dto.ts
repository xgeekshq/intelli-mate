import { RoomResponseSchema } from '@/types/rooms/room.response.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class RoomResponseDto extends createZodDto(RoomResponseSchema) {}
