import { z } from "zod";
import { SuperAdminLoginRequestSchema } from './super-admin-login.request.dto';

export type SuperAdminLoginRequestDto = z.infer<typeof SuperAdminLoginRequestSchema>;
