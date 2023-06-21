import queryString from 'query-string';

const Endpoints = {
  rooms: {
    getMyRooms: () => '/rooms/my',
    getPublicRooms: () => '/rooms/public',
    createRoom: () => '/rooms',
    updateRoom: (id: string) => `/rooms/settings/${id}`,
    getRoomByName: (name: string) => `/rooms/name/${name}`,
    leaveRoom: () => '/rooms/leave',
    inviteToRoom: () => '/rooms/invite',
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
};
export default Endpoints;
