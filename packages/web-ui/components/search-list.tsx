'use client';

import { ChevronsUpDown } from 'lucide-react';

import { PublicRoomsLisType, SearchListType } from '@/types/searchList';
import { Badge } from '@/components/ui/badge';
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

interface SearchListProps<T> {
  data: T[];
  searchText: string;
  searchPlaceholder: string;
  notFoundText: string;
  additionalText: string;
}
export function SearchList<T extends SearchListType & { isMember?: boolean }>({
  data,
  searchText,
  searchPlaceholder,
  notFoundText,
  additionalText = '',
}: SearchListProps<T>) {
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
              {data.map((item: T) => (
                <CommandItem
                  className="flex justify-between hover:cursor-pointer"
                  value={item.value}
                  key={item.value}
                >
                  {item.label}
                  {item.isMember && (
                    <Badge variant="outline">{additionalText}</Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
