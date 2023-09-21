import { string, z } from "zod";

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
    source: z
      .object({
        filename: z.string(),
        snippets: z.array(string()),
      })
      .optional(),
  }),
});
