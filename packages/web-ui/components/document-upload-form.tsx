'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { UploadDocumentsRequestSchema } from '@/contract/chats/upload-documents.request.dto';
import { UploadDocumentsRequestDto } from '@/contract/chats/upload-documents.request.dto.d';
import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Command, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { useMacUser } from '@/hooks/use-mac-user';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  FormDescription,
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
import { useToast } from '@/components/ui/use-toast';

export interface DocumentUploadFormProps {
  ownerRoles: string[];
}

export function DocumentUploadForm({ ownerRoles }: DocumentUploadFormProps) {
  const params = useParams();
  const roomId = params.room;

  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const { sessionId, getToken } = useAuth();
  const router = useRouter();
  const { isMacUser } = useMacUser();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'u' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, []);

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
        jwtToken: (await getToken()) ?? '',
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
        title:
          'The document has been uploaded successfully! We will notify you when the document is ready to be consulted.',
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
      <HoverCard>
        <HoverCardTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost">
              <Plus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
        </HoverCardTrigger>
        <HoverCardContent side="top" className="w-52">
          <div className="flex items-center justify-between">
            <p className="text-xs">Upload documents</p>
            <div className="flex items-center gap-1 rounded-lg border bg-gray-200 p-1">
              {isMacUser ? (
                <>
                  <Command height={10} width={10} />
                  <p className="text-xs">U</p>
                </>
              ) : (
                <p className="text-xs">Ctrl + U</p>
              )}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-4">Upload documents to chat</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="fileRoles"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Document roles</FormLabel>
                      <FormDescription>
                        Select the permission roles for the documents you are
                        uploading.
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
                    <FormLabel>Select document(s)</FormLabel>
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
                <Button type="submit">Upload</Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
