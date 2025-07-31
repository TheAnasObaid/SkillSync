import cors from "cors";
import { config } from "dotenv";
import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import appConfig from "./config/config";
import connectDB from "./config/database";
import errorHandler from "./middleware/errorHandler";
import adminRoute from "./routes/adminRoutes";
import authRoute from "./routes/authRoutes";
import challengesRoute from "./routes/challengeRoutes";
import submissionsRoute from "./routes/submissionRoutes";
import userRoute from "./routes/userRoutes";

const app = express();

config();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/users", userRoute);
app.use("/api/submissions", submissionsRoute);
app.use("/api/challenges", challengesRoute);

// --- SOCKET.IO INTEGRATION ---

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: appConfig.clientUrl,
    methods: ["GET", "POST"],
  },
});

let onlineUsers: { userId: string; socketId: string }[] = [];

const addUser = (userId: string, socketId: string) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: string) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on("addUser", (userId) => {
    if (!userId) return;
    addUser(userId, socket.id);
    console.log("Online users:", onlineUsers);
  });

  socket.on("join_challenge_room", (challengeId) => {
    socket.join(challengeId);
    console.log(`Socket ${socket.id} joined room ${challengeId}`);
  });

  socket.on("leave_challenge_room", (challengeId) => {
    socket.leave(challengeId);
    console.log(`Socket ${socket.id} left room ${challengeId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    removeUser(socket.id);
  });
});

export const emitToRoom = (roomId: string, eventName: string, data: any) => {
  io.to(roomId).emit(eventName, data);
  console.log(`Emitting event "${eventName}" to room ${roomId}`);
};

export const emitToUser = (userId: string, eventName: string, data: any) => {
  const user = getUser(userId);
  if (user) {
    io.to(user.socketId).emit(eventName, data);
  }
};

// IMPORTANT: The error handler must be the LAST middleware added.
app.use(errorHandler);

httpServer.listen(appConfig.port, () =>
  console.log(`🚀 Server is running on http://localhost:${appConfig.port}`)
);
