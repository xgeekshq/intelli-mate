export interface SearchListType {
  label: string;
  value: string;
}

export interface PublicRoomsListType extends SearchListType {
  isMember: boolean;
}

export interface UserListType extends SearchListType {
  imageUrl: string;
  userId: string;
}
