import { z } from "zod";
import { SuperAdminAddModelRequestSchema } from './super-admin-add-model.request.dto';

export type SuperAdminAddModelRequestDto = z.infer<typeof SuperAdminAddModelRequestSchema>;
