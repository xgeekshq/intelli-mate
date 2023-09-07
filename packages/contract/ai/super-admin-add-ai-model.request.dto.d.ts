import { SuperAdminAddAiModelRequestSchema } from "./super-admin-add-ai-model.request.dto";
import { z } from "zod";

export type SuperAdminAddAiModelRequestDto = z.infer<
  typeof SuperAdminAddAiModelRequestSchema
>;
