import queryString from 'query-string';

const Endpoints = {
  admin: {
    validateCredentials: () => '/auth/admin/validate-credentials',
    getUsers: () => '/auth/admin/users',
  },
  rooms: {
    getMyRooms: () => '/rooms/my',
    getPublicRooms: () => '/rooms/public',
    createRoom: () => '/rooms',
    updateRoom: (id: string) => `/rooms/settings/${id}`,
    getRoomById: (id: string) => `/rooms/${id}`,
    leaveRoom: () => '/rooms/leave',
    inviteToRoom: () => '/rooms/invite',
    joinRoom: () => '/rooms/join',
  },
  users: {
    getUser: (id: string) => `/auth/users/${id}`,
    getUsers: (userIds?: string[]) => {
      const url = `/auth/users?${queryString.stringify({ userIds })}`;
      if (!userIds || userIds?.length < 1) {
        return queryString.exclude(url, ['userIds']);
      }
      return url;
    },
  },
  chats: {
    getChat: (roomId: string) => `/chats/${roomId}`,
  },
};
export default Endpoints;
