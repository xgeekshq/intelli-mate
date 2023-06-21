import { z } from "zod";

export const InviteUserToRoomRequestSchema = z.object({
  userId: z.string(),
  roomId: z.string(),
});
