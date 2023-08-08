import { User } from '@/common/types/user';

export function doUserRolesMatch(users: User[], rolesToMatch: string[]) {
  return users.every((participant) =>
    participant.roles.sort().join(',').includes(rolesToMatch.sort().join(','))
  );
}
