import { GRID_SIZE, DIRS } from "../config/constants";
import { Grid, XY } from "../config/types";

export const countRemainingCells = (grid: Grid) => {
  return grid.flat().filter((cell) => cell === -1 || cell === 9).length;
};

export const countFlags = (grid: Grid) => {
  return grid.flat().filter((cell) => cell === 9).length;
};

export const getNeighbors = ({ x, y }: XY, grid: Grid) => {
  let neighbors: number[][] = [];
  let flags = 0;

  DIRS.forEach(([dx, dy]: [number, number]) => {
    const nx = x + dx;
    const ny = y + dy;

    if (nx >= 0 && ny >= 0 && nx < GRID_SIZE && ny < GRID_SIZE) {
      if (grid[nx][ny] === -1) {
        neighbors.push([nx, ny]);
      }
      else if (grid[nx][ny] === 9) flags++;
    }
  });
  return { neighbors, flags };
};

export const getRemainingCells = (grid: Grid) => {
  var cells = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (grid[x][y] === -1 || grid[x][y] === 9) cells.push(`${x},${y}`);
    }
  }
  return cells;
}