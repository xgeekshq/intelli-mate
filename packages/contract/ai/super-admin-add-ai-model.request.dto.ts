import { z } from "zod";

const defaultStringValidation = z
  .string()
  .transform((value) => value.trim())
  .refine((value) => value.length >= 1, {
    message: "Required",
  });

export const SuperAdminAddAiModelRequestSchema = z.object({
  chatLlmName: defaultStringValidation,
  alias: z.string().optional(),
  modelName: defaultStringValidation,
  temperature: z.number(),
  description: defaultStringValidation,
  meta: z.record(defaultStringValidation),
});
