'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAddAiModel } from '@/api/requests/super-admin/admin-add-ai-model';
import { SuperAdminAddAiModelRequestSchema } from '@/contract/ai/super-admin-add-ai-model.request.dto';
import { SuperAdminAddAiModelRequestDto } from '@/contract/ai/super-admin-add-ai-model.request.dto.d';
import { getSuperAdminCookieOnClient } from '@/utils/get-super-admin-cookie-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Textarea from 'react-textarea-autosize';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

export function AddAiModelsForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { adminCredentialsCookie } = getSuperAdminCookieOnClient();
  const { mutate: addAiModelReq, isLoading } = useMutation({
    mutationFn: async (values: SuperAdminAddAiModelRequestDto) =>
      adminAddAiModel(
        values,
        adminCredentialsCookie?.email ?? '',
        adminCredentialsCookie?.password ?? ''
      ),
    onError: (error: any) => {
      toast({
        title: error,
        variant: 'destructive',
      });
    },
    onSuccess: (room) => {
      setOpen(false);
      toast({
        title: 'AI Model added successfully!',
      });
      form.reset();
      // this refresh next server component https://nextjs.org/docs/app/api-reference/functions/use-router
      router.refresh();
    },
  });
  const form = useForm<SuperAdminAddAiModelRequestDto>({
    resolver: zodResolver(SuperAdminAddAiModelRequestSchema),
    values: {
      chatLlmName: 'ChatOpenAI',
      alias: '',
      modelName: '',
      temperature: 0.2,
      description: '',
      meta: {
        apiKey: '',
      },
    },
  });

  function onSubmit(values: SuperAdminAddAiModelRequestDto) {
    try {
      if (values.alias!.trim().length === 0) {
        values.alias = undefined;
      }
      addAiModelReq(values);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add AI Model</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[768px]">
        <DialogHeader>
          <DialogTitle>Add AI Model</DialogTitle>
          <Separator className="!my-4" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="chatLlmName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chat LLM Name</FormLabel>
                    <FormControl>
                      <Input disabled placeholder="ChatOpenAI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alias</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Identificative alias for a model"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-end gap-2">
                        Model Name
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Info width="14" height="14" />
                          </HoverCardTrigger>
                          <HoverCardContent className="min-w-[420px]">
                            <div>
                              <span>
                                Please choose one of the models listed on the
                                following page:
                              </span>{' '}
                              <a
                                className="underline"
                                target="_blank"
                                href="https://platform.openai.com/docs/models"
                              >
                                Models
                              </a>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="AI model name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        {...form.register('temperature', {
                          valueAsNumber: true,
                        })}
                        placeholder="0.2"
                        type="number"
                        max="1"
                        min="0"
                        step="0.1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="file: flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="This model was trained for..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="meta.apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Api Key</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full justify-end">
                <Button disabled={isLoading} type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
