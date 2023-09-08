import { z } from "zod";

export const AiModelResponseSchema = z.object({
  id: z.string(),
  chatLlmName: z.string(),
  alias: z.string().optional(),
  modelName: z.string(),
  description: z.string(),
});
