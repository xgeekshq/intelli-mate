'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GET_MY_ROOMS_REQ_KEY,
  getMyRooms,
} from '@/api/requests/rooms/get-my-rooms';
import {
  GET_PUBLIC_ROOMS_REQ_KEY,
  getPublicRooms,
} from '@/api/requests/rooms/get-public-rooms';
import { joinRoom } from '@/api/requests/rooms/join-room';
import { JoinRoomRequestDto } from '@/contract/rooms/join-room.request.dto.d';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { siteConfig } from '@/site-config/site';
import { SignedIn, UserButton, useAuth, useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Command } from 'lucide-react';

import { useBrowserInfo } from '@/hooks/use-browser-info';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import { MainNav } from '@/components/main-nav';
import { ThemeToggle } from '@/components/theme-toggle';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [notJoinedPublicRooms, setNotJoinedPublicRooms] = useState<
    RoomResponseDto[]
  >([]);
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const { sessionId, getToken, userId } = useAuth();
  const { isMacUser } = useBrowserInfo();
  const shouldShowSearchRoomsShortCut = useMemo(
    () => isSignedIn && !pathname.includes('admin'),
    [isSignedIn, pathname]
  );
  const { data: myRooms } = useQuery({
    queryKey: [GET_MY_ROOMS_REQ_KEY],
    queryFn: async () => getMyRooms(sessionId!, await getToken()),
  });
  const { data: publicRooms } = useQuery({
    queryKey: [GET_PUBLIC_ROOMS_REQ_KEY],
    queryFn: async () => getPublicRooms(sessionId!, await getToken()),
  });
  const { mutate: joinRoomMutationReq, isLoading } = useMutation({
    mutationFn: async (values: JoinRoomRequestDto) =>
      joinRoom(values, sessionId!, await getToken()),
    onError: (error: any) => {
      toast({
        title: error,
        variant: 'destructive',
      });
    },
    onSuccess: (room) => {
      toast({
        title: `Joined ${room.name}, welcome!`,
      });
      setOpen(false);
      // this refresh next server component https://nextjs.org/docs/app/api-reference/functions/use-router
      router.refresh();
      router.push(`/rooms/${room.id}`);
    },
  });

  useEffect(() => {
    if (shouldShowSearchRoomsShortCut) {
      const down = (e: KeyboardEvent) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setOpen((open) => !open);
        }
      };
      document.addEventListener('keydown', down);
      const setInitialData = async () => {
        const notJoinedPublicRooms = publicRooms?.filter((room) => {
          if (!room.members.includes(userId!)) {
            return room;
          }
        });

        setNotJoinedPublicRooms(notJoinedPublicRooms ?? []);
      };

      void setInitialData();
      return () => document.removeEventListener('keydown', down);
    }
  }, [shouldShowSearchRoomsShortCut, open]);

  const onMyRoomSelect = (roomId: string) => {
    router.push(`/rooms/${roomId}`);
    setOpen(false);
  };

  const onPublicRoomSelect = (values: JoinRoomRequestDto) => {
    try {
      joinRoomMutationReq(values);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background px-4">
      <div className="flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center gap-1">
            {shouldShowSearchRoomsShortCut && (
              <Button
                className="flex w-52 justify-between rounded-lg border"
                variant="ghost"
                onClick={() => setOpen(true)}
              >
                Search room...
                <div className="flex items-center gap-1 rounded-lg border bg-gray-200 p-1 dark:bg-gray-700">
                  {isMacUser ? (
                    <>
                      <Command height={10} width={10} />
                      <p className="text-xs">K</p>
                    </>
                  ) : (
                    <p className="text-xs">Ctrl + K</p>
                  )}
                </div>
              </Button>
            )}
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ThemeToggle />
            <div className="pl-3">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </nav>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a room name..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="My rooms">
            {myRooms?.map((myRoom) => (
              <CommandItem
                key={myRoom.id}
                onSelect={() => onMyRoomSelect(myRoom.id)}
              >
                {myRoom.name}
              </CommandItem>
            ))}
          </CommandGroup>
          {notJoinedPublicRooms.length > 0 && (
            <CommandGroup heading="Public rooms">
              {notJoinedPublicRooms!.map((publicRoom) => (
                <CommandItem
                  disabled={isLoading}
                  key={publicRoom.id}
                  onSelect={() => onPublicRoomSelect({ roomId: publicRoom.id })}
                >
                  {publicRoom.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </header>
  );
}
