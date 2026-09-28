import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db";
import { env } from "./config/env";
import app from "./app";
import { seedDatabase } from "./config/seed";

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

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  const PORT = Number(env.PORT) || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 BetSnipe Server listening on http://localhost:${PORT}`);
  });
};

startServer();

export { io };

