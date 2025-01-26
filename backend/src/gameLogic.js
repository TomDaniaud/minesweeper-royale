const players = require("./players");

let grid = [];
const GRID_SIZE = 10;

function initializeGrid() {
  grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
}

function startGame() {
  initializeGrid();
  return { grid, players: players.getPlayers() };
}

function revealCell(playerId, x, y) {
  if (grid[x][y] === 9) {
    players.removePlayer(playerId);
    return { eliminated: true, playerId };
  }
  return { x, y, value: grid[x][y] };
}

module.exports = { startGame, revealCell };
