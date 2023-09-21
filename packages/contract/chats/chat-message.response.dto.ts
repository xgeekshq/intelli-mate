import { z } from "zod";

export const ChatMessageResponseSchema = z.object({
  id: z.string(),
  sender: z.object({
    userId: z.string().optional(),
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
    source: z
      .object({
        filename: z.string(),
        snippets: z.array(z.string()),
      })
      .optional(),
  }),
  createdAt: z.string().datetime(),
});
