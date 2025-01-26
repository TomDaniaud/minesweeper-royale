const players = require("./players");

let grid = [];
let solveGrid = [];
let bombs = new Set();

const GRID_SIZE = 10;
const NB_BOMBS = 5;

function initializeGrid() {
  grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
  for (let i = 0; i < NB_BOMBS; i++) {
    var pos;
    do {
      pos = `${Math.floor(Math.random() * GRID_SIZE)},${Math.floor(Math.random() * GRID_SIZE)}`;
    } while (bombs.has(pos));
    bombs.add(pos);
  }
  solveGrid = Array(GRID_SIZE).fill().map((_, i) => {
    return Array(GRID_SIZE).fill(0).map((_, j) => {
      return countNeighbors(i, j);
    });
  });
  console.log(solveGrid)
}

function startGame() {
  initializeGrid();
  console.log(bombs);
  return { grid, players: players.getPlayers() };
}

function countNeighbors(x, y) {
  if (bombs.has(`${x},${y}`)) {
    return 9
  }
  var res = 0;
  var dir = [-1,0,1];
  dir.forEach(dx => {
    dir.forEach(dy => {
      if (bombs.has(`${x+dx},${y+dy}`)) {
        res++;
      }
    });
  });
  return res;
}

function revealCell(playerId, x, y) {
  console.log(`Revealing cell for player ${playerId}: (${x}, ${y})`);
  if (bombs.has(`${x},${y}`)) {
    players.removePlayer(playerId);
    return { eliminated: true, playerId };
  }
  return { x, y, value: solveGrid[x][y] };
}

module.exports = { startGame, revealCell };