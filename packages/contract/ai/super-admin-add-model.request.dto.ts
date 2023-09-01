import { z } from "zod";

export const SuperAdminAddModelRequestSchema = z.object({
  chatLlmName: z.string(),
  modelName: z.string(),
  apiKey: z.string(),
});
