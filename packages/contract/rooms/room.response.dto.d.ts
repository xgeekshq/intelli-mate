import { RoomResponseSchema } from "./room.response.dto";
import { z } from "zod";

export type RoomResponseDto = z.infer<typeof RoomResponseSchema>;
