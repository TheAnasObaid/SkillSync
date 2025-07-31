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
    // Only connect if the user is logged in
    if (user?._id) {
      const newSocket = io(process.env.NEXT_PUBLIC_API_BASE_URL!);
      setSocket(newSocket);

      // Send the user ID to the server to map it to the socket ID
      newSocket.emit("addUser", user._id);

      // Cleanup on component unmount or user change
      return () => {
        newSocket.disconnect();
      };
    } else {
      // If there's no user, make sure any existing socket is disconnected
      socket?.disconnect();
      setSocket(null);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
