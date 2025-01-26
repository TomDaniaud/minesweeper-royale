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

io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);
  players.addPlayer(socket.id);

  socket.on("startGame", () => {
    const gameState = gameLogic.startGame();
    io.emit("gameState", gameState);
  });

  socket.on("revealCell", ({ x, y }) => {
    const result = gameLogic.revealCell(socket.id, x, y);
    io.emit("gameUpdate", result);
  });

  socket.on("disconnect", () => {
    players.removePlayer(socket.id);
    console.log(`Player disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => console.log("Server running on port 3000"));
