import { z } from "zod";

export const UpdateRoomSettingsRequestSchema = z.object({
  name: z.string().optional(),
  private: z.boolean().optional(),
});
