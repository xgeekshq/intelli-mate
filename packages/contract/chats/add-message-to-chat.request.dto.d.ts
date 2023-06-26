import { z } from "zod";
import { AddMessageToChatRequestSchema } from './add-message-to-chat.request.dto';

export type AddMessageToChatRequestDto = z.infer<
  typeof AddMessageToChatRequestSchema
>;
