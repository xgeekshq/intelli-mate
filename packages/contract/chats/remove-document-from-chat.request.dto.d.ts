import { RemoveDocumentFromChatRequestSchema } from "./remove-document-from-chat.request.dto";
import { z } from "zod";

export type RemoveDocumentFromChatRequestDto = z.infer<
  typeof RemoveDocumentFromChatRequestSchema
>;
