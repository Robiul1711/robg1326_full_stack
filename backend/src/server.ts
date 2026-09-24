import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db";
import { env } from "./config/env";
import app from "./app";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

connectDB();

const PORT = Number(env.PORT) || 5000;

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

export { io };
