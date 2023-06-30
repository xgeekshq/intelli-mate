import { ChatMessageResponseSchema } from "./chat-message.response.dto";
import { z } from "zod";

export const ChatResponseSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  messageHistory: z.array(ChatMessageResponseSchema),
  participantIds: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
