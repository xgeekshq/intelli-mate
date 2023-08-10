'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { UploadDocumentsRequestSchema } from '@/contract/chats/upload-documents.request.dto';
import { UploadDocumentsRequestDto } from '@/contract/chats/upload-documents.request.dto.d';
import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCookie } from 'cookies-next';
import { Plus } from 'lucide-react';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export interface DocumentUploadFormProps {
  ownerRoles: string[];
}

export function DocumentUploadForm({ ownerRoles }: DocumentUploadFormProps) {
  const params = useParams();
  const roomId = params.room;

  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { sessionId } = useAuth();
  const token = getCookie('__session');
  const router = useRouter();

  const form = useForm<UploadDocumentsRequestDto>({
    resolver: zodResolver(UploadDocumentsRequestSchema),
    defaultValues: {
      fileRoles: [],
      files: undefined,
    },
  });

  async function onSubmit(values: UploadDocumentsRequestDto) {
    const formData = new FormData();
    formData.append('fileRoles', values.fileRoles.toString());
    Array.from(values.files).map((file) => formData.append('files', file));

    try {
      const res = await apiClient({
        url: Endpoints.chats.uploadDocuments(roomId),
        options: {
          method: 'POST',
          body: formData,
        },
        sessionId: sessionId ?? '',
        jwtToken: token?.toString() ?? '',
        isApplicationJson: false,
      });
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
        title: 'Files upload successfully',
      });
      form.reset();
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  }
  const fileRoles = ownerRoles.map((ownerRole) => {
    return { id: ownerRole, label: ownerRole };
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload documents to chat</DialogTitle>
          <DialogDescription>
            Upload documents to that chat and navigate throw them with the help
            of AI!
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="fileRoles"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>File roles</FormLabel>
                      <FormDescription>
                        Select the roles for the files that you will upload.
                      </FormDescription>
                    </div>
                    {fileRoles.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="fileRoles"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  // @ts-ignore
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value: string) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="files"
                render={() => (
                  <FormItem>
                    <FormLabel>File roles</FormLabel>
                    <FormControl>
                      <Input
                        {...form.register('files')}
                        type="file"
                        id="fileupload"
                        name="files"
                        multiple
                      />
                    </FormControl>
                    <FormMessage />
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
