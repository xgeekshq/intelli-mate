export interface SearchListType {
  label: string;
  value: string | null;
}

export interface PublicRoomsListType extends SearchListType {
  isMember: boolean;
  roomId: string;
}

export interface UserListType extends SearchListType {
  imageUrl: string;
  userId: string;
}

export interface UserListType extends SearchListType {
  imageUrl: string;
  userId: string;
}
