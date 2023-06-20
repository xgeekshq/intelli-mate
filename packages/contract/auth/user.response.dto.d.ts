import { z } from "zod";
import { UserResponseSchema } from './user.response.dto';

export type UserResponseDto = z.infer<typeof UserResponseSchema>;
