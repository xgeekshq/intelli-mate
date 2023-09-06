import { SuperAdminAddAiModelRequestSchema } from '@/contract/ai/super-admin-add-ai-model.request.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class SuperAdminAddAiModelRequestDto extends createZodDto(
  SuperAdminAddAiModelRequestSchema
) {}
