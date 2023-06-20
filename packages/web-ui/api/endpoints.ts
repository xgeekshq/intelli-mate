import * as wasi from 'wasi';

const Endpoints = {
  rooms: {
    getMyRooms: () => '/rooms/my',
    getPublicRooms: () => '/rooms/public',
    createRoom: () => '/rooms',
    updateRoom: (id: string) => `/rooms/setting/${id}`,
  },
  users: {
    getUsers: (users: string) => `auth/users/${users}`,
  },
};
export default Endpoints;
