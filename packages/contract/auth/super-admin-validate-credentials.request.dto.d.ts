import { SuperAdminValidateCredentialsRequestSchema } from "./super-admin-validate-credentials.request.dto";
import { z } from "zod";

export type SuperAdminValidateCredentialsRequestDto = z.infer<
  typeof SuperAdminValidateCredentialsRequestSchema
>;
