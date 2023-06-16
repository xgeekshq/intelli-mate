import { CreateRoomRequestSchema } from "./create-room.request.dto";
import { z } from "zod";

export type CreateRoomRequestDto = z.infer<typeof CreateRoomRequestSchema>;
