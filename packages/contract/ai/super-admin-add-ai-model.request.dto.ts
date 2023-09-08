import { defaultStringValidation } from "../validators/string.validator";
import { z } from "zod";

export const SuperAdminAddAiModelRequestSchema = z.object({
  chatLlmName: defaultStringValidation,
  alias: z.string().optional(),
  modelName: defaultStringValidation,
  temperature: z.number(),
  description: defaultStringValidation,
  meta: z.record(defaultStringValidation),
});
