import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const SocketContext = createContext(null);

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(SOCKET_SERVER_URL, {
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("⚡ Admin connected to real-time socket:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("🔌 Admin disconnected from socket");
      setIsConnected(false);
    });

    // Listen for new leads submitted by customers on the frontend!
    socketInstance.on("NEW_LEAD_NOTIFICATION", (lead) => {
      toast.success(
        `🔔 New Lead from ${lead.fullName} (${lead.phone})!`,
        {
          duration: 6000,
          position: "top-right",
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid #80CF16",
          },
        }
      );
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
