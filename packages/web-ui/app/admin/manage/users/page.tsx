import React from 'react';
import {
  ADMIN_GET_ALL_USERS_REQ_KEY,
  adminGetAllUsers,
} from '@/api/requests/super-admin/admin-get-all-users';
import { getSuperAdminCookieOnServer } from '@/utils/get-super-admin-cookie-server';
import { getUserEmail } from '@/utils/get-user-email';
import { alphaAscSortPredicate } from '@/utils/sort-predicates';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UpdateRolesForm } from '@/components/admin/update-roles-form';
import getQueryClient from '@/app/get-query-client';

export default async function AdminUsers() {
  const { adminCredentialsCookie } = getSuperAdminCookieOnServer();
  const adminCredentials = JSON.parse(adminCredentialsCookie!.value);
  const queryClient = getQueryClient();
  const users = await queryClient.fetchQuery({
    queryKey: [ADMIN_GET_ALL_USERS_REQ_KEY],
    queryFn: () =>
      adminGetAllUsers(adminCredentials.email, adminCredentials.password),
  });

  return (
    <div className="flex h-full w-full p-4">
      <Card className="w-full">
        <ScrollArea className="h-full">
          <Table>
            <TableCaption>
              All intelli-mate users are listed here along with their roles.
            </TableCaption>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="w-20"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar className="h-8 w-8 text-right">
                      <AvatarImage
                        src={user.profileImageUrl}
                        alt="Profile Image"
                      />
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{getUserEmail(user)}</TableCell>
                  <TableCell>
                    {user.roles.sort(alphaAscSortPredicate).join(', ')}
                  </TableCell>
                  <TableCell className="text-right">
                    <UpdateRolesForm
                      userId={user.id}
                      defaultRoles={user.roles}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}
