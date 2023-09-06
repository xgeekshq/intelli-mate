import { SuperAdminAddAiModelRequestSchema } from "./super-admin-add-ai-model.request.dto";
import { z } from "zod";

export type SuperAdminAddModelRequestDto = z.infer<
  typeof SuperAdminAddAiModelRequestSchema
>;
