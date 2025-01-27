const players = require("./players");

type Grid = number[][];

interface Player {
  id: string;
  grid: Grid;
  eliminated: boolean;
}

let grid = <Grid>[];
let solveGrid = <Grid>[];
let bombs = new Set<String>();

const GRID_SIZE = 10;
const NB_BOMBS = 15;
const DIRS: [number, number][] = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

function initializeGrid(): void {
  grid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(-1));
  bombs.clear()
  for (let i = 0; i < NB_BOMBS; i++) {
    var pos;
    do {
      pos = `${Math.floor(Math.random() * GRID_SIZE)},${Math.floor(Math.random() * GRID_SIZE)}`;
    } while (bombs.has(pos));
    bombs.add(pos);
  }
  solveGrid = Array(GRID_SIZE).fill(0).map((_, i) => {
    return Array(GRID_SIZE).fill(0).map((_, j) => {
      return countNeighbors(i, j);
    });
  });
}

function startGame() {
  if (grid.length === 0){
    initializeGrid();
    selectStartCell();
    console.log(bombs);
  }
  return { grid, players: players.getPlayers() };
}

function selectStartCell() {
  var choice = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (solveGrid[i][j] === 0)
        choice.push([i,j]);
    }
  }
  var [x,y] = choice[Math.floor(Math.random()*choice.length)];
  getCells(x,y).forEach(cell => {
    console.log()
    grid[cell.x][cell.y] = cell.value;
  });
}

function countNeighbors(x: number, y: number) {
  if (bombs.has(`${x},${y}`)) {
    return 9;
  }
  var res = 0;
  DIRS.forEach(d => {
    if (bombs.has(`${x+d[0]},${y+d[1]}`)) {
      res++;
    }
  });
  return res;
}

function getCells(x: number, y: number) {
  if (solveGrid[x][y] !== 0) {
    return [{x, y, value: solveGrid[x][y]}];
  }
  var res = [];
  var stack: [number, number][] = [[x,y]];
  var visited = new Set();
  var nx: number, ny: number, cell: number, dx: number, dy: number;
  while (stack.length) {
    [nx, ny] = stack.pop()!;
    cell = solveGrid[nx][ny];
    if (visited.has(`${nx},${ny}`))
      continue;
    res.push({x: nx, y: ny, value: cell});
    visited.add(`${nx},${ny}`);
    if (cell !== 0)
      continue;
    DIRS.forEach(d => {
      dx = nx + d[0];
      dy = ny + d[1];
      if (-1 < dx && dx < GRID_SIZE && -1 < dy && dy < GRID_SIZE && !visited.has(`${dx},${dy}`)){
        stack.push([dx, dy]);
      }
    });
  }
  return res;
}

function revealCell(playerId: Player, x: number, y: number) {
  if (bombs.has(`${x},${y}`)) {
    players.removePlayer(playerId);
    return { eliminated: true, playerId };
  }
  return { cells: getCells(x,y) };
}

module.exports = { startGame, revealCell };