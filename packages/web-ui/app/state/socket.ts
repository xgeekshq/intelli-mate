import { atom } from 'recoil';
import io, { Socket } from 'socket.io-client';

// @ts-ignore
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket'],
});

export const socketState = atom<Socket>({
  key: 'Socket',
  default: socket,
  dangerouslyAllowMutability: true,
});
