import { z } from "zod";

export const SuperAdminAddModelRequestSchema = z.object({
  chatLlmName: z.string(),
  modelName: z.string(),
  temperature: z.number(),
  description: z.string(),
  meta: z.record(z.string()).optional(),
});
