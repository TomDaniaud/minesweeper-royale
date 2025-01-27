import { Socket } from "socket.io";

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const gameManager = require("./gameManager");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }
});

io.on("connection", (socket: Socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on("requestGameState", () => {
    console.log(`Sending gameState to ${socket.id}`);
    const initialGameState = gameManager.startGame(socket.id);
    socket.emit("gameState", initialGameState);
  });

  socket.on("revealCell", ({ x, y }) => {
    console.log(`Received revealCell event from ${socket.id}: (${x}, ${y})`);
    const result = gameManager.revealCell(socket.id, x, y);
    socket.emit("gameUpdate", result);
  });

  socket.on("isGridValid", ({ cells }) => {
    console.log(`Received isGridValid event from ${socket.id}`);
    const result = gameManager.goToNextLevel(socket.id, cells);
    socket.emit("gameUpdate", result);
  });

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => console.log("Server running on port 3000"));