import { AiModelResponseSchema } from "./ai-model.response.dto";
import { z } from "zod";

export type AiModelResponseDto = z.infer<typeof AiModelResponseSchema>;
