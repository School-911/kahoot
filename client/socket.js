import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ['websocket'], // ⚠️ Bắt buộc để không lỗi polling trên Render
  withCredentials: true
});

export default socket;

     