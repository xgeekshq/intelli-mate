import { InviteUserToRoomRequestSchema } from '@/contract/rooms/invite-user-to-room.request.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class InviteUserToRoomRequestDto extends createZodDto(
  InviteUserToRoomRequestSchema
) {}
