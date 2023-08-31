import { Role } from '@/common/types/user-roles';

type EmailAddress = {
  readonly id: string;
  readonly emailAddress: string;
};

export type User = {
  readonly id: string;
  readonly primaryEmailAddressId: string | null;
  readonly profileImageUrl: string;
  readonly username: string | null;
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly emailAddresses: EmailAddress[];
  readonly roles: Role[];
};
