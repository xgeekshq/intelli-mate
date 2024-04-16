import '@/styles/globals.css';
import {
  GET_MY_ROOMS_REQ_KEY,
  getMyRooms,
} from '@/api/requests/rooms/get-my-rooms';
import { auth } from '@clerk/nextjs';
import { Hydrate, dehydrate } from '@tanstack/react-query';

import { Rooms } from '@/components/rooms';
import { StateProvider } from '@/components/state-provider';
import getQueryClient from '@/app/get-query-client';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RoomsLayout({ children }: RootLayoutProps) {
  const { getToken } = auth();
  const token = await getToken();
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery([GET_MY_ROOMS_REQ_KEY], () =>
    getMyRooms(token)
  );
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <div className="flex h-full">
        <StateProvider>
          <Rooms />
          <div className="size-full">{children}</div>
        </StateProvider>
      </div>
    </Hydrate>
  );
}
