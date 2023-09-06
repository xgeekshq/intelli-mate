import { z } from "zod";

export const CreateChatForRoomRequestSchema = z.object({
  roomId: z.string(),
  aiModelId: z.string(),
});
