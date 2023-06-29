'use client';

import { useRouter } from 'next/navigation';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { UpdateRoomSettingsRequestSchema } from '@/contract/rooms/update-room-settings.request.dto';
import { UpdateRoomSettingsRequestDto } from '@/contract/rooms/update-room-settings.request.dto.d';
import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCookie } from 'cookies-next';
import { Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

interface UpdateRoomFormProps {
  id: string;
  name: string;
  isPrivate: boolean;
}
export function UpdateRoomForm({ id, name, isPrivate }: UpdateRoomFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { sessionId } = useAuth();
  const token = getCookie('__session');

  const form = useForm<UpdateRoomSettingsRequestDto>({
    resolver: zodResolver(UpdateRoomSettingsRequestSchema),
    defaultValues: {
      name: name,
      isPrivate: isPrivate,
    },
  });

  async function onSubmit(values: UpdateRoomSettingsRequestDto) {
    try {
      const res = await apiClient({
        url: Endpoints.rooms.updateRoom(id),
        options: { method: 'PATCH', body: JSON.stringify(values) },
        sessionId: sessionId ?? '',
        jwtToken: token?.toString() ?? '',
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
      router.push(`/rooms/${values.name}/settings`);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <p className="text-sm font-bold">Update Room</p>
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
            name="isPrivate"
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
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
