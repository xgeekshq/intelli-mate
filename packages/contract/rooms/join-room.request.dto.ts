import { z } from "zod";

export const JoinRoomRequestSchema = z.object({
  roomId: z.string(),
});
