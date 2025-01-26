let playerList = {};

function addPlayer(id) {
  playerList[id] = { lives: 3 };
}

function removePlayer(id) {
  delete playerList[id];
}

function getPlayers() {
  return playerList;
}

module.exports = { addPlayer, removePlayer, getPlayers };
