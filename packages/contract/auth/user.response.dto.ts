import { z } from "zod";

const EmailAddressResponseSchema = z.object({
  id: z.string(),
  emailAddress: z.string(),
});

export const UserResponseSchema = z.object({
  id: z.string(),
  primaryEmailAddressId: z.string(),
  imageUrl: z.string(),
  username: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  emailAddresses: z.array(EmailAddressResponseSchema),
  roles: z.array(z.string()),
});
