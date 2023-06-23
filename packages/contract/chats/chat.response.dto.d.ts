import { z } from "zod";
import { ChatResponseSchema } from './chat.response.dto';

export type ChatResponseDto = z.infer<typeof ChatResponseSchema>;
