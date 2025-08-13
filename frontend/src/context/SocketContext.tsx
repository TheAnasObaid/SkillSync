"use client";

import { useAuthStore } from "@/store/authStore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user?._id) {
      const newSocket = io(process.env.NEXT_PUBLIC_API_BASE_URL!);
      setSocket(newSocket);
      newSocket.emit("addUser", user._id);
      return () => {
        newSocket.disconnect();
      };
    } else {
      socket?.disconnect();
      setSocket(null);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
