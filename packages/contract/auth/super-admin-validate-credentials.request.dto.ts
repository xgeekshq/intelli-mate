import { z } from "zod";

export const SuperAdminValidateCredentialsRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
