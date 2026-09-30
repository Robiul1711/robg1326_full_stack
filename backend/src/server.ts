import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db";
import { env } from "./config/env";
import app from "./app";
import { seedDatabase } from "./config/seed";

const server = http.createServer(app);

const io = new Server(server, {
 cors: {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://bet-snipe.vercel.app",
      "*",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
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

