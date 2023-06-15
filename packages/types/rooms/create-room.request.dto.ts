// import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

export const CreateRoomRequestSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must have at least 3 characters" })
    .max(50, { message: "Name must have at most 50 characters" }),
  private: z.boolean().default(false),
  owner: z.string(),
});

// export class CreateRoomRequestDto extends createZodDto(
//   CreateRoomRequestSchema
// ) {}
