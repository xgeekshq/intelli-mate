import { SuperAdminAddModelRequestSchema } from '@/contract/ai/super-admin-add-model.request.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class SuperAdminAddModelRequestDto extends createZodDto(
  SuperAdminAddModelRequestSchema
) {}
