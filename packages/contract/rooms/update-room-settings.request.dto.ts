import { z } from "zod";

export const UpdateRoomSettingsRequestSchema = z.object({
  name: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length >= 3, {
      message: "Name must have at least 3 characters",
    })
    .refine((value) => value.length <= 50, {
      message: "Name must have at most 50 characters",
    }),
  isPrivate: z.boolean().optional(),
});
