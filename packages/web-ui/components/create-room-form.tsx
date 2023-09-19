'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom } from '@/api/requests/rooms/create-room';
import { AiModelResponseDto } from '@/contract/ai/ai-model.response.dto.d';
import { CreateRoomRequestSchema } from '@/contract/rooms/create-room.request.dto';
import { CreateRoomRequestDto } from '@/contract/rooms/create-room.request.dto.d';
import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Info, Lock, Plus } from 'lucide-react';
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';

type CreateRoomFormProps = {
  aiModels: AiModelResponseDto[] | undefined;
};

export function CreateRoomForm({ aiModels }: CreateRoomFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { userId, getToken } = useAuth();
  const router = useRouter();
  const { mutate: createRoomMutationReq, isLoading } = useMutation({
    mutationFn: async (values: CreateRoomRequestDto) =>
      createRoom(values, await getToken()),
    onError: (error: any) => {
      toast({
        title: error,
        variant: 'destructive',
      });
    },
    onSuccess: (room) => {
      setOpen(false);
      toast({
        title: 'Room created successfully!',
      });
      form.reset();
      // this refresh next server component https://nextjs.org/docs/app/api-reference/functions/use-router
      router.refresh();
      router.push(`/rooms/${room.id}`);
    },
  });
  const form = useForm<CreateRoomRequestDto>({
    resolver: zodResolver(CreateRoomRequestSchema),
    defaultValues: {
      name: '',
      aiModelId: '',
      isPrivate: false,
      ownerId: userId ?? '',
    },
  });

  function onSubmit(values: CreateRoomRequestDto) {
    try {
      createRoomMutationReq(values);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new Room</DialogTitle>
          <DialogDescription>
            Create a new room and start chatting!
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
                      <Input placeholder="intelli-mate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aiModelId"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>
                      <div className="flex items-end gap-2">
                        Chat LLM
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Info width="14" height="14" />
                          </HoverCardTrigger>
                          <HoverCardContent className="min-w-[360px]">
                            Select an LLM that better matches your needs.
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {aiModels?.map((aiModel) => (
                          <FormItem
                            key={aiModel.id}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={aiModel.id} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <p>
                                    {aiModel.chatLlmName} -{' '}
                                    {aiModel.alias ?? 'no alias provided'}
                                  </p>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                  <div className="flex justify-between space-x-4">
                                    {aiModel.description}
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
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
                        // @ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex w-full justify-end">
                <Button disabled={isLoading} type="submit">
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
