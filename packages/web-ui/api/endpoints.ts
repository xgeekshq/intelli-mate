import queryString from 'query-string';

const Endpoints = {
  admin: {
    validateCredentials: () => '/auth/admin/validate-credentials',
    getUsers: () => '/auth/admin/users',
    updateUserRoles: () => '/auth/admin/update-user-roles',
    getAiModels: () => '/ai/admin/ai-models',
    addAiModel: () => '/ai/admin/ai-models',
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
    deleteRoom: (id: string) => `/rooms/${id}`,
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
    uploadDocuments: (roomId: string) => `/chats/${roomId}/upload-documents`,
    deleteDocument: (roomId: string) => `/chats/${roomId}/remove-document`,
  },
  ai: {
    getAiModels: () => '/ai/ai-models',
  },
};
export default Endpoints;
