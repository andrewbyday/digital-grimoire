import { Server } from "socket.io";

const io = new Server(3000, {
   cors: {
      origin: 'http://localhost:5173',
      methods: ["GET", "POST"]
   }
});

io.on("connection", (socket) => {
   console.log('Connected:', socket.id);

   socket.emit("hello", "world");
});