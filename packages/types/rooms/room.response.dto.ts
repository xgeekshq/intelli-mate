import { z } from "zod";

export const RoomResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  private: z.boolean().default(false),
  owner: z.string(),
  members: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});
