import { z } from "zod";

export const LeaveRoomRequestSchema = z.object({
  roomId: z.string(),
});
