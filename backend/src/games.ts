import {GRID_SIZE, NB_BOMBS, Grid ,DIRS} from "./config/constants";
import {countNeighbors} from "./utils/gridHelpers";


export interface Game {
    id: number;
    grid: Grid;
    solveGrid: Grid;
    bombs: Set<string>;
  }

export function generateGame(id: number): Game {
    var data = initializeGrid();
    var grid = data.grid;
    var solveGrid = data.solveGrid;
    var bombs = data.bombs;
    selectStartCell(grid, solveGrid);
    return { id, grid, solveGrid, bombs };
}

function initializeGrid() {
  const grid: Grid = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(-1));
  const bombs: Set<string> = new Set();
  for (let i = 0; i < NB_BOMBS; i++) {
    let pos: string;
    do {
      pos = `${Math.floor(Math.random() * GRID_SIZE)},${Math.floor(Math.random() * GRID_SIZE)}`;
    } while (bombs.has(pos));
    bombs.add(pos);
  }
  const solveGrid: Grid = Array(GRID_SIZE)
    .fill(null)
    .map((_, i) =>
      Array(GRID_SIZE)
        .fill(0)
        .map((_, j) => countNeighbors(i, j, bombs))
    );
  return { grid, bombs, solveGrid };
}

function selectStartCell(grid:Grid, solveGrid: Grid) {
    var choice = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (solveGrid[i][j] === 0) choice.push([i,j]);
      }
    }
    var [x,y] = choice[Math.floor(Math.random()*choice.length)];
    getCells(solveGrid, x, y).forEach(cell => {
      grid[cell.x][cell.y] = cell.value;
    });
}

export function getCells(solveGrid:Grid, x: number, y: number) {
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