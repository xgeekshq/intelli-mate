const Endpoints = {
  rooms: {
    getMyRooms: () => '/rooms/my',
    getPublicRooms: () => '/rooms/public',
    createRoom: () => '/rooms',
    updateRoom: (id: string) => `/rooms/setting/${id}`,
  },
};
export default Endpoints;
