import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const useSocket = (setGrid) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    console.log("Connecting to WebSocket...");

    if (socket.connected) {
      console.log("Socket already connected");
      socket.emit("requestGameState");
    }

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket")
      setIsConnected(false);
    });

    socket.on("gameState", (data) => {
      if (data.grid) setGrid([...data.grid.map(row => [...row])]);
    });

    socket.on("gameUpdate", (data) => {
      if (data.eliminated) {
        alert("You lost !!");
      } else if (data.win) {
        alert('You win !!')
        setGrid([...data.grid.map(row => [...row])]);
      } else if (data.cells) {
        setGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          data.cells.forEach(cell => (newGrid[cell.x][cell.y] = cell.value));
          return newGrid;
        });
      }
    });

    return () => {
      socket.off("gameState");
      socket.off("gameUpdate");
    };
  }, [setGrid]);

  useEffect(() => {
    if (isConnected) {
      socket.emit("requestGameState");
    }
  }, [isConnected]);

  return socket;
};

export default useSocket;
