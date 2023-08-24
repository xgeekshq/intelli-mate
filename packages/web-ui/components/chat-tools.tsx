'use client';

import { useRouter } from 'next/navigation';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { ChatDocumentSchema } from '@/contract/chats/chat.response.dto';
import { RemoveDocumentFromChatRequestDto } from '@/contract/chats/remove-document-from-chat.request.dto.d';
import { useAuth } from '@clerk/nextjs';
import { getCookie } from 'cookies-next';
import { Trash } from 'lucide-react';
import { z } from 'zod';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';

type ChatToolsProps = {
  documents: z.infer<typeof ChatDocumentSchema>[];
  roomId: string;
  isOwner: boolean;
};

export function ChatTools({ documents, roomId, isOwner }: ChatToolsProps) {
  const { sessionId } = useAuth();
  const token = getCookie('__session');
  const router = useRouter();

  const deleteDocument = async (values: RemoveDocumentFromChatRequestDto) => {
    try {
      const res = await apiClient({
        url: Endpoints.chats.deleteDocument(roomId),
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
        title: 'Document deleted successfully!',
      });
      // this refresh next server component https://nextjs.org/docs/app/api-reference/functions/use-router
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex h-full min-w-[var(--chat-tools)] max-w-[var(--chat-tools)] flex-col border-l">
      <ScrollArea className="flex-1">
        <div className="space-y-1">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="documents"
          >
            <AccordionItem className="p-4" value="documents">
              <AccordionTrigger className="p-0">Documents</AccordionTrigger>
              <AccordionContent className="pb-0 pt-2">
                {documents?.map((document) => (
                  <HoverCard key={document.meta.filename}>
                    <HoverCardTrigger className="flex items-center justify-between rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
                      <div className="max-w-[140px] truncate">
                        <p className="text-gray-500">
                          {document.meta.vectorDBDocumentName}
                        </p>
                        <p>{document.meta.filename}</p>
                      </div>
                      {isOwner && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="xs">
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="sm:max-w-[425px]">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {`Are you sure you want to delete ${document.meta.vectorDBDocumentName} - ${document.meta.filename}?`}
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-500/80"
                                onClick={() => {
                                  void deleteDocument({
                                    filename: document.meta.filename,
                                  });
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </HoverCardTrigger>
                    {document.meta.vectorDBDocumentDescription && (
                      <HoverCardContent side="left">
                        {document.meta.vectorDBDocumentDescription}
                      </HoverCardContent>
                    )}
                  </HoverCard>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
