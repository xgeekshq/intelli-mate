import { SuperAdminUpdateUserRoleRequestSchema } from '@/contract/auth/super-admin-update-role.request.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class SuperAdminUpdateUserRoleRequestDto extends createZodDto(
  SuperAdminUpdateUserRoleRequestSchema
) {}
