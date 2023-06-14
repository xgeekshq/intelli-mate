import { RoomResponseSchema } from "./room.response.dto";
import { z } from "zod";

export type RoomResponseDtoType = z.infer<typeof RoomResponseSchema>;
