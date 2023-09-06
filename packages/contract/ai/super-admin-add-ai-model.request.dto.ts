import { z } from "zod";

export const SuperAdminAddAiModelRequestSchema = z.object({
  chatLlmName: z.string(),
  alias: z.string(),
  modelName: z.string(),
  temperature: z.number(),
  description: z.string(),
  meta: z.record(z.string()),
});
