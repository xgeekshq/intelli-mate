import { z } from "zod";
import { CreateRoomResponseSchema } from './create-room.response.dto';

export type CreateRoomResponseDtoType = z.infer<typeof CreateRoomResponseSchema>;
