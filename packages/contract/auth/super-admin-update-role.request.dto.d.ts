import { z } from "zod";
import { SuperAdminLoginRequestSchema } from './super-admin-login.request.dto';
import { SuperAdminUpdateUserRoleRequestSchema } from './super-admin-update-role.request.dto';

export type SuperAdminUpdateUserRoleRequestDto = z.infer<typeof SuperAdminUpdateUserRoleRequestSchema>;
