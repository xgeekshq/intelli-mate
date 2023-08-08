import { z } from "zod";

export const RemoveDocumentFromChatRequestSchema = z.object({
  filename: z.string(),
});
