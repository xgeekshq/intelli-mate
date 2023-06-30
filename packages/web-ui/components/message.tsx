import React from 'react';
import { getUserIdentification } from '@/utils/get-user-identification';
import { format } from 'date-fns';

import { ChatMessageType } from '@/types/chat';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

export interface MessageProps {
  message: ChatMessageType;
}

export function Message({ message }: MessageProps) {
  return (
    <div className="mb-2 flex flex-col rounded border bg-background">
      <div className="mb-2 flex items-center justify-between p-4 text-gray-500">
        {message.user && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.user?.imageUrl} alt="Profile Image" />
            </Avatar>
            <p>{getUserIdentification(message.user)}</p>
          </div>
        )}
        <p className="text-sm">
          {format(new Date(message.createdAt), 'dd-MM-yyyy HH:mm')}
        </p>
      </div>
      <p className="px-4">{message.content}</p>
      {message.response ? (
        <div className="mt-4 flex gap-2 border-t bg-gray-50 p-4 dark:bg-gray-900">
          <Avatar className="h-8 w-8 rounded-none">
            <AvatarImage src={'/ai.png'} alt="AI Image" />
          </Avatar>
          <p>{message.response}</p>
        </div>
      ) : (
        <iframe
          src="https://embed.lottiefiles.com/animation/144586"
          className="h-8 w-8"
        ></iframe>
      )}
    </div>
  );
}
