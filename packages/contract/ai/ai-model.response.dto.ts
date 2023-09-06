import { z } from "zod";

export const AiModelResponseSchema = z.object({
  id: z.string(),
  chatLlmName: z.string(),
  alias: z.string(),
  modelName: z.string(),
  temperature: z.number(),
  description: z.string(),
  meta: z.record(z.string()),
});
