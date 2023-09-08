import { SuperAdminAiModelResponseSchema } from "./super-admin-ai-model.response.dto";
import { z } from "zod";

export type SuperAdminAiModelResponseDto = z.infer<
  typeof SuperAdminAiModelResponseSchema
>;
