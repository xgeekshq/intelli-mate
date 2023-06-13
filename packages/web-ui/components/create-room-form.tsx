'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { CreateRoomRequestSchema } from '@/types/rooms/create-room.request.dto';
import { CreateRoomRequestDtoType } from '@/types/rooms/create-room.request.dto.d';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Room name must be at least 2 characters.',
  }),
  private: z.boolean().default(false).optional(),
  owner: z.string(),
});

export function CreateRoomForm() {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateRoomRequestDtoType>({
    resolver: zodResolver(CreateRoomRequestSchema),
    defaultValues: {
      name: '',
      private: false,
      owner: '',
    },
  });

  async function onSubmit(values: CreateRoomRequestDtoType) {
    console.log(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" data-testid="cenas">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new Room</DialogTitle>
          <DialogDescription>
            Create a new room and start chatting with the AI bot!
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Intellimate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="private"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <Lock className="h-4 w-4" />
                    <FormLabel>Is this room private?</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex w-full justify-end">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
