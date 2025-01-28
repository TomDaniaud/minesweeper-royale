import { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const useSocket = () => {

  useEffect(() => {
    console.log("Connecting to WebSocket...");

    if (socket.connected) {
      console.log("Socket already connected");
    }

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return socket;
};

export default useSocket;
