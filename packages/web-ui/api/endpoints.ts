const Endpoints = {
  rooms: {
    getMyRooms: () => '/rooms/my',
    getPublicRooms: () => '/rooms/public',
    createRoom: () => '/room',
    updateRoom: (id: string) => `/room/${id}`,
  },
};
export default Endpoints;
