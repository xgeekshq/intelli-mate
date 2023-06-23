import { z } from "zod";

export const ChatMessageResponseSchema = z.object({
  id: z.string(),
  sender: z.object({
    userId: z.string(),
    isAi: z.boolean(),
    aiMeta: z
      .object({
        llmModel: z.string(),
        tokens: z.number(),
        replyTo: z.string(),
      })
      .optional(),
  }),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
