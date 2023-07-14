import { z } from "zod";

export const SuperAdminUpdateUserRoleRequestSchema = z.object({
  userId: z.string(),
  roles: z.array(z.string()).min(1),
});
