// Gửi request ping để đánh thức backend trước
fetch(import.meta.env.VITE_SOCKET_URL + '/ping')
  .then(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true
    });

    // dùng socket ở đây...
    console.log("✅ Socket kết nối sau khi ping backend");
  })
  .catch((err) => {
    console.error("❌ Backend chưa sẵn sàng:", err);
  });
