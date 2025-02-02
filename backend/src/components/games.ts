import { config, Grid, DIRS, TIMER_EVOLUTION } from "../config/constants";
import { countNeighbors } from "../utils/gridHelpers";

export type Bombs = Set<string>;

export default class Game {
  id: number;
  grid: Grid;
  solvedGrid: Grid;
  bombs: Bombs;
  timer: number;
  closingTime: number;

  constructor(id: number) {
    this.id = id;
    const data = this.initializeGrid();
    this.grid = data.grid;
    this.solvedGrid = data.solveGrid;
    this.bombs = data.bombs;
    this.timer = this.getTimer(id);
    this.closingTime = 0;
    this.selectStartCell(this.grid, this.solvedGrid);
  }

  private getTimer(id: number) {
    if (id >= TIMER_EVOLUTION.length) return 1;
    return TIMER_EVOLUTION[id];
  }

  private initializeGrid() {
    const grid: Grid = Array(config.GRID_SIZE)
      .fill(null)
      .map(() => Array(config.GRID_SIZE).fill(-1));
    const bombs: Set<string> = new Set();
    for (let i = 0; i < config.NB_BOMBS; i++) {
      let pos: string;
      do {
        pos = `${Math.floor(Math.random() * config.GRID_SIZE)},${Math.floor(Math.random() * config.GRID_SIZE)}`;
      } while (bombs.has(pos));
      bombs.add(pos);
    }
    const solveGrid: Grid = Array(config.GRID_SIZE)
      .fill(null)
      .map((_, i) =>
        Array(config.GRID_SIZE)
          .fill(0)
          .map((_, j) => countNeighbors(i, j, bombs))
      );
    return { grid, bombs, solveGrid };
  }

  private selectStartCell(grid: Grid, solvedGrid: Grid) {
    var choice = [];
    for (let i = 0; i < config.GRID_SIZE; i++) {
      for (let j = 0; j < config.GRID_SIZE; j++) {
        if (solvedGrid[i][j] === 0) choice.push([i, j]);
      }
    }
    var [x, y] = choice[Math.floor(Math.random() * choice.length)];
    this.getCells(solvedGrid, x, y).forEach(cell => {
      grid[cell.x][cell.y] = cell.value;
    });
  }

  private getCells(solvedGrid: Grid, x: number, y: number) {
    if (solvedGrid[x][y] !== 0) {
      return [{ x, y, value: solvedGrid[x][y] }];
    }
    var res = [];
    var stack: [number, number][] = [[x, y]];
    var visited = new Set();
    var nx: number, ny: number, cell: number, dx: number, dy: number;
    while (stack.length) {
      [nx, ny] = stack.pop()!;
      cell = solvedGrid[nx][ny];
      if (visited.has(`${nx},${ny}`))
        continue;
      res.push({ x: nx, y: ny, value: cell });
      visited.add(`${nx},${ny}`);
      if (cell !== 0)
        continue;
      DIRS.forEach(d => {
        dx = nx + d[0];
        dy = ny + d[1];
        if (-1 < dx && dx < config.GRID_SIZE && -1 < dy && dy < config.GRID_SIZE && !visited.has(`${dx},${dy}`)) {
          stack.push([dx, dy]);
        }
      });
    }
    return res;
  }

  public isGameWin(bombs: Bombs, cells: String[]) {
    var cellsSet = new Set<String>(cells);
    if (bombs.size !== cellsSet.size) return false;
    for (let cell of bombs) {
      if (!cellsSet.has(cell)) return false;
    }
    return true;
  }

  public revealCells(bombs: Bombs, solvedGrid: Grid, x: number, y: number) {
    if (x >= config.GRID_SIZE || y >= config.GRID_SIZE || x < 0 || y < 0)
      return [];
    if (bombs.has(`${x},${y}`))
      return [];
    return this.getCells(solvedGrid, x, y);
  }
}
// gbtg



