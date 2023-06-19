import { z } from "zod";

export const InviteUserToRoomRequestSchema = z.object({
  user: z.string(),
  roomId: z.string(),
});
