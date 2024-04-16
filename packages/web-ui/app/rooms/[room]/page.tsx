import { GET_CHAT_REQ_KEY, getChat } from '@/api/requests/rooms/get-chat';
import { GET_ROOM_REQ_KEY, getRoom } from '@/api/requests/rooms/get-room';
import { GET_USER_REQ_KEY, getUser } from '@/api/requests/users/get-user';
import { auth } from '@clerk/nextjs';
import { Hydrate, dehydrate } from '@tanstack/react-query';

import Chat from '@/components/chat';
import { ChatTools } from '@/components/chat-tools';
import getQueryClient from '@/app/get-query-client';

export default async function Room({ params }: { params: { room: string } }) {
  const { getToken, userId } = auth();
  const token = await getToken();
  const queryClient = getQueryClient();
  const room = await queryClient.fetchQuery([GET_ROOM_REQ_KEY], () =>
    getRoom(params.room, token)
  );
  const chat = await queryClient.fetchQuery([GET_CHAT_REQ_KEY], () =>
    getChat(params.room, token)
  );
  const owner = await queryClient.fetchQuery([GET_USER_REQ_KEY], () =>
    getUser(room.ownerId, token)
  );
  const dehydratedState = dehydrate(queryClient);
  const isOwner = owner.id === userId;
  const chatHasDocuments = chat.documents.length > 0;

  return (
    <Hydrate state={dehydratedState}>
      <div className="flex size-full">
        <Chat
          roomId={params.room}
          isOwner={isOwner}
          hasDocuments={chatHasDocuments}
          ownerRoles={owner.roles}
        />
        {chatHasDocuments && (
          <ChatTools
            documents={chat.documents}
            roomId={params.room}
            isOwner={isOwner}
          />
        )}
      </div>
    </Hydrate>
  );
}
