'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateRoom } from '@/api/requests/rooms/update-room';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { UpdateRoomSettingsRequestSchema } from '@/contract/rooms/update-room-settings.request.dto';
import { UpdateRoomSettingsRequestDto } from '@/contract/rooms/update-room-settings.request.dto.d';
import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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
  room: RoomResponseDto;
}

export function UpdateRoomForm({ room }: UpdateRoomFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { getToken } = useAuth();
  const [originalName, setOriginalName] = useState(room.name);
  const [originalPrivacy, setOriginalPrivacy] = useState(room.isPrivate);
  const { mutate: updateRoomMutationReq, isLoading } = useMutation({
    mutationFn: async (values: UpdateRoomSettingsRequestDto) =>
      updateRoom(room.id, values, await getToken()),
    onError: (error: any) => {
      toast({
        title: error,
        variant: 'destructive',
      });
    },
    onSuccess: (room) => {
      toast({
        title: 'Room updated successfully!',
      });
      setOriginalName(room.name);
      setOriginalPrivacy(room.isPrivate);
      router.refresh();
    },
  });
  const form = useForm<UpdateRoomSettingsRequestDto>({
    resolver: zodResolver(UpdateRoomSettingsRequestSchema),
    defaultValues: {
      name: room.name,
      isPrivate: room.isPrivate,
    },
  });
  const isFormChanged = useMemo(() => {
    const formValues = form.getValues();
    return (
      originalName !== formValues.name ||
      originalPrivacy !== formValues.isPrivate
    );
  }, [originalName, originalPrivacy, form.getValues()]);

  async function onSubmit(values: UpdateRoomSettingsRequestDto) {
    try {
      updateRoomMutationReq(values);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <p className=" font-bold">General</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Name</FormLabel>
                <FormControl>
                  <Input placeholder="intelli-mate" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem className="flex w-full items-center space-x-2 space-y-0">
                <Lock className="size-4" />
                <FormLabel className="w-52">Is this room private?</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    // @ts-ignore
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="flex w-full justify-end">
                  <Button
                    disabled={isLoading || !isFormChanged}
                    variant="success"
                    type="submit"
                  >
                    Save
                  </Button>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
