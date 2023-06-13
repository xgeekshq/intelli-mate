import { z } from "zod";
import { CreateRoomRequestSchema } from './create-room.request.dto';

export type CreateRoomRequestDtoType = z.infer<typeof CreateRoomRequestSchema>;
