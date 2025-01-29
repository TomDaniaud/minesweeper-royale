import { Socket, Server } from "socket.io";
import express from "express";
import http from "http";
import { canLaunchMatch, findMatch, getFirstGame, havePlayerWinGame, playPlayerAction, startMatch } from "./matchManagers.js";
import { NB_PLAYER_PER_MATCH } from "./config/constants.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }
});

io.on("connection", (socket: Socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on("joinQueue", () => {
    var playerId = socket.id;
    var match = findMatch(playerId);
    if (match === undefined) // player already in a queue
      return;
    console.log(`Add player ${playerId} into match : ${match.id}`);
    socket.emit("updateQueue", {count: match.nbPlayers, nb_player_per_match: NB_PLAYER_PER_MATCH});
    if (canLaunchMatch(match.id)){
      console.log(`Start match ${match.id}`);
      const initialGameState = startMatch(match.id);
      io.emit("matchFound", initialGameState); // TODO: don't send to every player connect
    }
  });

  socket.on("requestGameState", () => {
    console.log(`Sending gameState to ${socket.id}`);
    const initialGameState = getFirstGame(socket.id);
    socket.emit("gameState", initialGameState);
  });

  socket.on("revealCell", ({ x, y }) => {
    console.log(`Received revealCell event from ${socket.id}: (${x}, ${y})`);
    const result = playPlayerAction(socket.id, x, y);
    socket.emit("gameUpdate", result);
  });

  socket.on("isGridValid", ({ cells }) => {
    console.log(`Received isGridValid event from ${socket.id}`);
    const result = havePlayerWinGame(socket.id, cells);
    socket.emit("gameStatus", result);
    if (result.win)
      io.emit("timerStart", {time: 0}); // TODO: don't send to every player connect
  });

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => console.log("Server running on port 3000"));