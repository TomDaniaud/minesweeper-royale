import { Socket } from "socket.io";

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const gameLogic = require("./gameLogic");
const players = require("./players");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }
});

io.on("connection", (socket: Socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on("requestGameState", () => {
    console.log(`Sending gameState to ${socket.id}`);
    const initialGameState = gameLogic.startGame();
    socket.emit("gameState", initialGameState);
  });

  socket.on("revealCell", ({ x, y }) => {
    console.log(`Received revealCell event from ${socket.id}: (${x}, ${y})`);
    const result = gameLogic.revealCell(socket.id, x, y);
    io.emit("gameUpdate", result);
  });

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => console.log("Server running on port 3000"));