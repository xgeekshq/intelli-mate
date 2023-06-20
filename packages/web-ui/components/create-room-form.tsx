'use client';

import { useState } from 'react';
import { client } from '@/api/client';
import Endpoints from '@/api/endpoints';
import { CreateRoomRequestSchema } from '@/contract/rooms/create-room.request.dto';
import { CreateRoomRequestDto } from '@/contract/rooms/create-room.request.dto.d';
import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCookie } from 'cookies-next';
import { Lock, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

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
import { ToastAction } from '@/components/ui/toast';
import { toast, useToast } from '@/components/ui/use-toast';

export function CreateRoomForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { userId, sessionId } = useAuth();
  const token = getCookie('__session');

  const form = useForm<CreateRoomRequestDto>({
    resolver: zodResolver(CreateRoomRequestSchema),
    defaultValues: {
      name: '',
      private: false,
      owner: !!userId ? userId : '',
    },
  });

  async function onSubmit(values: CreateRoomRequestDto) {
    try {
      const res = await client({
        url: Endpoints.rooms.createRoom(),
        options: { method: 'POST', body: JSON.stringify(values) },
        sessionId: sessionId ? sessionId : '',
        jwtToken: token ? token.toString() : '',
      });
      console.log(res);
      if (!res.ok) {
        const { error } = JSON.parse(await res.text());

        toast({
          title: error,
          variant: 'destructive',
        });
        return;
      }
      setOpen(false);
      toast({
        title: 'Room created successfully!',
      });
    } catch (e) {
      console.log(e);
    }
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
