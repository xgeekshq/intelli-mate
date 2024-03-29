import { defaultStringValidation } from "../validators/string.validator";
import { z } from "zod";

export const CreateRoomRequestSchema = z.object({
  name: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length >= 3, {
      message: "Name must have at least 3 characters",
    })
    .refine((value) => value.length <= 50, {
      message: "Name must have at most 50 characters",
    }),
  aiModelId: defaultStringValidation,
  isPrivate: z.boolean().default(false),
  ownerId: z.string(),
});
