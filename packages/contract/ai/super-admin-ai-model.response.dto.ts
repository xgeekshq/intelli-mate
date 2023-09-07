import { z } from "zod";

export const SuperAdminAiModelResponseSchema = z.object({
  id: z.string(),
  chatLlmName: z.string(),
  alias: z.string().optional(),
  modelName: z.string(),
  temperature: z.number(),
  description: z.string(),
  meta: z.record(z.string()),
});
