import { z } from "zod";

export const SuperAdminLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
