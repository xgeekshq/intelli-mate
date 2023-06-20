import { cookies } from 'next/headers';
import { client } from '@/api/client';
import Endpoints from '@/api/endpoints';
import { auth } from '@clerk/nextjs';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SearchList } from '@/components/search-list';
import { UpdateRoomForm } from '@/components/update-room-form';

const getOwver = async () => {
  try {
    const { sessionId } = auth();
    const nextCookies = cookies();
    const clerkJwtToken = nextCookies.get('__session');
    const res = await client({
      url: Endpoints.users.getUsers('s'),
      options: { method: 'GET' },
      sessionId: sessionId ? sessionId : '',
      jwtToken: clerkJwtToken ? clerkJwtToken.value : '',
    });
    return res.json();
  } catch (e) {
    console.log(e);
  }
};

export default function Settings() {
  return (
    <div className="h-full p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Room Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 p-4">
            <UpdateRoomForm />
            <div className="flex flex-col gap-2 rounded-lg border p-4">
              <p className="text-sm font-bold">Room Owner</p>
              <div className="flex gap-2">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p>ShadCN UI</p>
                  <p className="text-sm text-gray-500">shadcn/ui</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border p-4">
              <p className="text-sm font-bold">Users List</p>
              <SearchList<any>
                data={[]}
                notFoundText="User not found."
                searchPlaceholder="Type a user username"
                searchText="Search for a user"
                additionalText=""
                width="w-full"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="destructive" size="lg">
            Leave room
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
