import { z } from "zod";
import { ChatMessageResponseSchema } from './chat-message.response.dto';

export type ChatMessageResponseDto = z.infer<typeof ChatMessageResponseSchema>;
