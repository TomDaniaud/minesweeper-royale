import { GRID_SIZE, DIRS } from "../config/constants";

export const countRemainingCells = (grid) => {
  return grid.flat().filter((cell) => cell === -1).length;
};

export const getNeighbors = (x, y, grid) => {
  let neighbors = [];
  let flags = 0;
  DIRS.forEach(([dx, dy]) => {
    const nx = x + dx, ny = y + dy;
    if (nx >= 0 && ny >= 0 && nx < GRID_SIZE && ny < GRID_SIZE) {
      if (grid[nx][ny] === -1) neighbors.push([nx, ny]);
      else if (grid[nx][ny] === 9) flags++;
    }
  });
  return { neighbors, flags };
};
