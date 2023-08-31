'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { JoinRoomRequestDto } from '@/contract/rooms/join-room.request.dto.d';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { siteConfig } from '@/site-config/site';
import { SignedIn, UserButton, useAuth, useUser } from '@clerk/nextjs';
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
  const [myRooms, setMyRooms] = useState<RoomResponseDto[]>([]);
  const [publicRooms, setPublicRooms] = useState<RoomResponseDto[]>([]);

  const router = useRouter();
  const { isSignedIn } = useUser();
  const { sessionId, getToken, userId } = useAuth();
  const { isMacUser } = useBrowserInfo();

  async function getMyRooms() {
    try {
      const res = await apiClient({
        url: Endpoints.rooms.getMyRooms(),
        options: { method: 'GET' },
        sessionId: sessionId ?? '',
        jwtToken: (await getToken()) ?? '',
      });
      return res.json();
    } catch (e) {
      console.log(e);
    }
  }

  async function getPublicRooms() {
    try {
      const res = await apiClient({
        url: Endpoints.rooms.getPublicRooms(),
        options: { method: 'GET' },
        sessionId: sessionId ?? '',
        jwtToken: (await getToken()) ?? '',
      });
      return res.json();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      const down = (e: KeyboardEvent) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setOpen((open) => !open);
        }
      };
      document.addEventListener('keydown', down);
      const setInitialData = async () => {
        const myRooms: RoomResponseDto[] = await getMyRooms();
        const publicRooms: RoomResponseDto[] = await getPublicRooms();

        const notJoinedPublicRooms = publicRooms.filter((room) => {
          if (!room.members.includes(userId!)) {
            return room;
          }
        });

        setMyRooms(myRooms);
        setPublicRooms(notJoinedPublicRooms);
      };

      void setInitialData();

      return () => document.removeEventListener('keydown', down);
    }
  }, [isSignedIn, open]);

  const handleMyRoomSelect = (roomId: string) => {
    router.push(`/rooms/${roomId}`);
    setOpen(false);
  };

  const handlePublicRoomSelect = async (values: JoinRoomRequestDto) => {
    try {
      const res = await apiClient({
        url: Endpoints.rooms.joinRoom(),
        options: { method: 'POST', body: JSON.stringify(values) },
        sessionId: sessionId ?? '',
        jwtToken: (await getToken()) ?? '',
      });

      if (!res.ok) {
        const { error } = JSON.parse(await res.text());
        toast({
          title: error,
          variant: 'destructive',
        });
        return;
      }

      const room: RoomResponseDto = await res.json();
      toast({
        title: `Joined ${room.name}, welcome!`,
      });
      setOpen(false);
      // this refresh next server component https://nextjs.org/docs/app/api-reference/functions/use-router
      router.refresh();
      router.push(`/rooms/${room.id}`);
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
            {isSignedIn && (
              <Button
                className="flex w-52 justify-between rounded-lg border"
                variant="ghost"
                onClick={() => setOpen(true)}
              >
                Search room...
                <div className="flex items-center gap-1 rounded-lg border bg-gray-200 p-1">
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
            {myRooms!.map((myRoom) => (
              <CommandItem
                key={myRoom.id}
                onSelect={() => handleMyRoomSelect(myRoom.id)}
              >
                {myRoom.name}
              </CommandItem>
            ))}
          </CommandGroup>
          {publicRooms.length > 0 && (
            <CommandGroup heading="Public rooms">
              {publicRooms!.map((publicRoom) => (
                <CommandItem
                  key={publicRoom.id}
                  onSelect={() =>
                    handlePublicRoomSelect({ roomId: publicRoom.id })
                  }
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
