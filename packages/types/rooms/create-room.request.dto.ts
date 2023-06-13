import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

export const CreateRoomRequestSchema = z.object({
  name: z.string(),
  private: z.boolean().default(false),
  owner: z.string(),
});

export class CreateRoomRequestDto extends createZodDto(
  CreateRoomRequestSchema
) {}
