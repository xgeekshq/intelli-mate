import { CreateChatForRoomRequestSchema } from "./create-chat-for-room.request.dto";
import { z } from "zod";

export type CreateChatForRoomRequestDto = z.infer<
  typeof CreateChatForRoomRequestSchema
>;
