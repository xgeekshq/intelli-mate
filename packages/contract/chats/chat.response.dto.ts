import { ChatMessageResponseSchema } from "./chat-message.response.dto";
import { ObjectId } from "mongodb";
import { z } from "zod";

const zObjectIdString = z
  .unknown()
  .transform((objectId: ObjectId) => objectId.toString());

export const ChatResponseSchema = z.object({
  id: z.string(),
  roomId: zObjectIdString,
  messageHistory: z.array(ChatMessageResponseSchema),
  participantIds: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});
