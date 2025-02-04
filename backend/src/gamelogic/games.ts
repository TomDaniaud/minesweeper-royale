import { config, Grid, DIRS, TIMER_EVOLUTION } from "../config/constants";

export type Bombs = Set<string>;

export default class Game {
  id: number;
  grid!: Grid;
  solvedGrid!: Grid;
  bombs: Bombs;
  timer: number;
  closingTime: number;

  constructor(id: number) {
    this.id = id;
    this.bombs = new Set();
    this.closingTime = 0;
    this.timer = this.getTimer(id);

    this.initializeGrid();
    this.selectStartCell();
  }

  private getTimer(id: number) {
    if (id >= TIMER_EVOLUTION.length) return 1;
    return TIMER_EVOLUTION[id];
  }

  private initializeGrid() {
    this.grid = Array.from({ length: config.GRID_SIZE }, () => Array(config.GRID_SIZE).fill(-1));
    this.solvedGrid = Array.from({ length: config.GRID_SIZE }, (_, i) =>
      Array.from({ length: config.GRID_SIZE }, (_, j) => this.countNeighbors(i, j))
    );

    for (let i = 0; i < config.NB_BOMBS; i++) {
      let pos: string;
      do {
        pos = `${Math.floor(Math.random() * config.GRID_SIZE)},${Math.floor(Math.random() * config.GRID_SIZE)}`;
      } while (this.bombs.has(pos));
      this.bombs.add(pos);
    }
  }

  private selectStartCell() {
    var choice = [];
    for (let i = 0; i < config.GRID_SIZE; i++) {
      for (let j = 0; j < config.GRID_SIZE; j++) {
        if (this.solvedGrid[i][j] === 0) choice.push([i, j]);
      }
    }
    if (choice.length === 0) {
      throw new Error("No valid start cells available");
    }
    var [x, y] = choice[Math.floor(Math.random() * choice.length)];
    this.getCells(x, y).forEach(cell => {
      this.grid[cell.x][cell.y] = cell.value;
    });
  }

  private getCells(x: number, y: number) {
    if (this.solvedGrid[x][y] !== 0) {
      return [{ x, y, value: this.solvedGrid[x][y] }];
    }
    var res = [];
    var stack: [number, number][] = [[x, y]];
    var visited = new Set();
    var nx: number, ny: number, cell: number, dx: number, dy: number;
    while (stack.length) {
      [nx, ny] = stack.pop()!;
      cell = this.solvedGrid[nx][ny];
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

  public isWin(cells: String[]) {
    var cellsSet = new Set<String>(cells);
    if (this.bombs.size !== cellsSet.size) return false;
    for (let cell of this.bombs) {
      if (!cellsSet.has(cell)) return false;
    }
    return true;
  }

  public revealCells(x: number, y: number) {
    if (x >= config.GRID_SIZE || y >= config.GRID_SIZE || x < 0 || y < 0)
      return [];
    if (this.bombs.has(`${x},${y}`))
      return [];
    return this.getCells(x, y);
  }

  public countNeighbors(x: number, y: number): number {
    if (this.bombs.has(`${x},${y}`)) {
      return 9;
    }
    var res = 0;
    DIRS.forEach(d => {
      if (this.bombs.has(`${x + d[0]},${y + d[1]}`)) {
        res++;
      }
    });
    return res;
  }

}
// gbtg



