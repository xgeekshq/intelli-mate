import { z } from "zod";
import { InviteUserToRoomRequestSchema } from './invite-user-to-room.request.dto';

export type InviteUserToRoomRequestDto = z.infer<typeof InviteUserToRoomRequestSchema>;
