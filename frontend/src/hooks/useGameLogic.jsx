import { useState, useEffect } from "react";
import { countFlags, countRemainingCells, getNeighbors, getRemainingCells,  } from "../utils/gridHelpers";
import { NB_BOMBS } from "../config/constants";

const useGameLogic = (grid, setGrid, socket) => {
  const [dig, setDig] = useState(true);
  const [placeFlags, setFlags] = useState(countFlags(grid));
  const [remainingCells, setRemaining] = useState(countRemainingCells(grid));

  useEffect(() => {
    setRemaining(countRemainingCells(grid));
    setFlags(countFlags(grid));
  }, [grid]);

  useEffect(() => {
    if (remainingCells === NB_BOMBS) isGridFinish();
  }, [remainingCells])

  const toggleDig = () => setDig((prev) => !prev);

  const handleClick = (x, y) => {
    if (dig && grid[x][y] === -1) {  // unknown cell
      socket.emit("revealCell", { x, y });
    } else if (!dig && (grid[x][y] === -1 || grid[x][y] === 9)) { // place or remove flag
      const updatedGrid = [...grid];
      updatedGrid[x][y] = updatedGrid[x][y] === -1 ? 9 : -1;
      setGrid(updatedGrid);
    } else if (grid[x][y] !== 0) {
      var data = getNeighbors(x,y, grid);
      if (grid[x][y] <= data.flags) // dig around known cell
        data.neighbors.forEach(cell => socket.emit("revealCell", { x:cell[0], y:cell[1] } ));
    }
  };

  const isGridFinish = () => {
    socket.emit("isGridValid", {cells: getRemainingCells(grid)});
  }

  return { dig, toggleDig, handleClick, placeFlags, remainingCells };
};

export default useGameLogic;
