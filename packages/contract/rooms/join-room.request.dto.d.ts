import { z } from "zod";
import { JoinRoomRequestSchema } from './join-room.request.dto';

export type JoinRoomRequestDto = z.infer<typeof JoinRoomRequestSchema>;
