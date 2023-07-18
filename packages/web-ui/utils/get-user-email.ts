import { UserResponseDto } from '@/contract/auth/user.response.dto.d';

export function getUserEmail(user: UserResponseDto) {
  return (
    user.emailAddresses.find((email) => user.primaryEmailAddressId === email.id)
      ?.emailAddress ?? ''
  );
}
