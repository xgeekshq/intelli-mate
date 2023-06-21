import { z } from "zod";

export const RoomResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  isPrivate: z.boolean().default(false),
  ownerId: z.string(),
  members: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});
