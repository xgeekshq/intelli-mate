import { ChatUserType } from '@/types/chat';

export const getUserIdentification = (user: ChatUserType): string => {
  if (user.name) {
    return user.name;
  }
  if (user.userName) {
    return user.userName;
  }
  return user.email;
};
