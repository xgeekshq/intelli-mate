import { z } from "zod";

export const UpdateRoomSettingsRequestSchema = z.object({
  name: z.string().optional(),
  isPrivate: z.boolean().optional(),
});
