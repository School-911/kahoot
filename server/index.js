const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://kahoot-ova0.onrender.com', // Cho phép từ frontend Render
  credentials: false // Vì bạn không cần cookie / session
}));

app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Tạo HTTP server
const server = http.createServer(app);

// Tạo socket.io instance
const io = new Server(server, {
  cors: {
    origin: 'https://kahoot-ova0.onrender.com',
    methods: ['GET', 'POST'],
    credentials: false
  }
});

// Gắn xử lý socket
io.on('connection', (socket) => {
  console.log('🟢 New socket connected:', socket.id);

  // Bắt sự kiện test
  socket.on('ping', () => {
    socket.emit('pong');
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

// Các route API
app.get('/', (req, res) => {
  res.send('Kahoot backend is running!');
});

// Khởi động server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
