import { z } from "zod";

export const AddMessageToChatRequestSchema = z.object({
  sender: z.object({
    isAi: z.boolean(),
  }),
  content: z.string(),
  meta: z.object({
    tokens: z.number(),
    replyTo: z.string().optional(),
    ai: z
      .object({
        llmModel: z.string(),
      })
      .optional(),
  }),
});
