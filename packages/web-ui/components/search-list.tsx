'use client';

import { ChevronsUpDown } from 'lucide-react';

import { SearchListType } from '@/types/searchList';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

type SearchListProps = {
  data: SearchListType[];
  searchText: string;
  searchPlaceholder: string;
  notFoundText: string;
};
export function SearchList({
  data,
  searchText,
  searchPlaceholder,
  notFoundText,
}: SearchListProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-96 justify-between text-muted-foreground"
        >
          {searchText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0">
        <ScrollArea className="h-96">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              {data.map((room: SearchListType) => (
                <CommandItem value={room.value} key={room.value}>
                  {room.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
