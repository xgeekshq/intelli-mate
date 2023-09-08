import { ChatMessageResponseSchema } from "./chat-message.response.dto";
import { z } from "zod";

export const ChatDocumentSchema = z.object({
  roles: z.array(z.string()),
  meta: z.object({
    mimetype: z.string(),
    filename: z.string(),
    size: z.number(),
    queryable: z.boolean(),
    vectorDBDocumentName: z.string().nullable(),
    vectorDBDocumentDescription: z.string().nullable(),
  }),
});

export const ChatResponseSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  aiModelId: z.string(),
  messageHistory: z.array(ChatMessageResponseSchema),
  documents: z.array(ChatDocumentSchema),
  participantIds: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
