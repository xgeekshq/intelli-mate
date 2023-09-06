import { string, z } from "zod";

export const CreateRoomRequestSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must have at least 3 characters" })
    .max(50, { message: "Name must have at most 50 characters" }),
  aiModelId: string(),
  isPrivate: z.boolean().default(false),
  ownerId: z.string(),
});
