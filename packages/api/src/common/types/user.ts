type EmailAddress = {
  id: string;
  emailAddress: string;
};

export type User = {
  id: string;
  primaryEmailAddressId: string | null;
  profileImageUrl: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: EmailAddress[];
};
