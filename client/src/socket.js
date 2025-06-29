// socket.js - stub
import { io } from 'socket.io-client'

// Khởi tạo kết nối socket đến server backend
const socket = io(import.meta.env.VITE_SOCKET_URL) // Thay bằng domain khi deploy

export default socket
     