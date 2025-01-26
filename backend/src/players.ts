export interface Player {
  lives: number;
}

let playerList: Record<string, Player>  = {};

function addPlayer(id: number) {
  playerList[id] = { lives: 3 };
}

function removePlayer(id: number) {
  delete playerList[id];
}

function getPlayers() {
  return playerList;
}

module.exports = { addPlayer, removePlayer, getPlayers };
