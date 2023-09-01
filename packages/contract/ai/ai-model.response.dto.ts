import { z } from "zod";

export const AiModelResponseSchema = z.object({
  chatLlmName: z.string(),
  modelName: z.string(),
  apiKey: z.string(),
});
