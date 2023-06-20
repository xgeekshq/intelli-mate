import { UserResponseSchema } from '@/contract/auth/user.response.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
