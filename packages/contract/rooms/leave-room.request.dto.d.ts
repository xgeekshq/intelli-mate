import { z } from "zod";
import { LeaveRoomRequestSchema } from './leave-room.request.dto';

export type LeaveRoomRequestDto = z.infer<typeof LeaveRoomRequestSchema>;
