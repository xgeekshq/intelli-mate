import { LeaveRoomRequestSchema } from '@/contract/rooms/leave-room.request.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class LeaveRoomRequestDto extends createZodDto(LeaveRoomRequestSchema) {}
