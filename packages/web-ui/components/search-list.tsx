'use client';

import { ReactNode } from 'react';
import { ChevronsUpDown } from 'lucide-react';

import { SearchListType } from '@/types/searchList';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SearchListProps {
  children: ReactNode;
  searchText: string;
  searchPlaceholder: string;
  notFoundText: string;
  width?: string;
}
export function SearchList<T extends SearchListType & { isMember?: boolean }>({
  children,
  searchText,
  searchPlaceholder,
  notFoundText,
  width = 'w-96',
}: SearchListProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`${width} justify-between text-muted-foreground`}
        >
          {searchText}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0">
        <ScrollArea className="h-96">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>{children}</CommandGroup>
          </Command>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
