import { io } from 'socket.io-client';

let socket;

fetch(import.meta.env.VITE_SOCKET_URL + '/ping')
  .then(() => {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true
    });
  })
  .catch((err) => {
    console.error('Không thể kết nối backend:', err);
  });

export default socket;
