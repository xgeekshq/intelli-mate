import { ChatUserType } from '@/types/chat';

export const getUserIdentification = (user: ChatUserType): string => {
  return user.name ?? user.userName ?? user.email;
};
