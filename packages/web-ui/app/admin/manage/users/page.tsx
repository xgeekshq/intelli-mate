import React from 'react';
import { cookies } from 'next/headers';
import Endpoints from '@/api/endpoints';
import { superAdminApiClient } from '@/api/superAdminApiClient';
import { UserResponseDto } from '@/contract/auth/user.response.dto.d';
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

const getUsers = async (
  superAdminEmail: string,
  superAdminPassword: string
): Promise<UserResponseDto[]> => {
  try {
    const res = await superAdminApiClient({
      url: Endpoints.admin.getUsers(),
      options: { method: 'GET' },
      superAdminEmail,
      superAdminPassword,
    });
    return res.json();
  } catch (e) {
    console.log(e);
  }
  return [];
};

export default async function AdminUsers() {
  const nextCookies = cookies();
  const adminCredentialsCookie = nextCookies.get('__admin');
  const adminCredentials = JSON.parse(adminCredentialsCookie!.value);

  const users = await getUsers(
    adminCredentials.email,
    adminCredentials.password
  );

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
