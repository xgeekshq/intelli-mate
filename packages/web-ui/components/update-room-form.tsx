'use client';

import { useState } from 'react';
import { client } from '@/api/client';
import Endpoints from '@/api/endpoints';
import { CreateRoomRequestSchema } from '@/contract/rooms/create-room.request.dto';
import { CreateRoomRequestDto } from '@/contract/rooms/create-room.request.dto.d';
import { UpdateRoomSettingsRequestSchema } from '@/contract/rooms/update-room-settings.request.dto';
import { UpdateRoomSettingsRequestDto } from '@/contract/rooms/update-room-settings.request.dto.d';
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
import { useToast } from '@/components/ui/use-toast';

export function UpdateRoomForm() {
  const { toast } = useToast();
  const { sessionId } = useAuth();
  const token = getCookie('__session');

  const form = useForm<UpdateRoomSettingsRequestDto>({
    resolver: zodResolver(UpdateRoomSettingsRequestSchema),
    defaultValues: {
      name: '',
      private: false,
    },
  });

  async function onSubmit(values: UpdateRoomSettingsRequestDto) {
    try {
      const res = await client({
        url: Endpoints.rooms.updateRoom('roomId'),
        options: { method: 'PATCH', body: JSON.stringify(values) },
        sessionId: sessionId ? sessionId : '',
        jwtToken: token ? token.toString() : '',
      });
      if (!res.ok) {
        const { error } = JSON.parse(await res.text());
        toast({
          title: error,
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Room updated successfully!',
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="rounded-lg border p-4">
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
            <Button variant="success" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
