import { useState, useEffect } from "react";
import { countRemainingCells, getNeighbors } from "../utils/gridHelpers";

const useGameLogic = (initialGrid) => {
  const [grid, setGrid] = useState(initialGrid);
  const [dig, setDig] = useState(true);
  const [placeFlags, updateFlags] = useState(0);
  const [remainingCells, setRemaining] = useState(countRemainingCells(initialGrid));

  useEffect(() => {
    setRemaining(countRemainingCells(grid));
  }, [grid]);

  const toggleDig = () => setDig((prev) => !prev);

  const handleClick = (x, y, socket) => {
    if (dig && grid[x][y] === -1) {  // unknown cell
      socket.emit("revealCell", { x, y });
    } else if (!dig && (grid[x][y] === -1 || grid[x][y] === 9)) { // place or remove flag
      const updatedGrid = [...grid];
      updatedGrid[x][y] = updatedGrid[x][y] === -1 ? 9 : -1;
      updateFlags((prev) => (updatedGrid[x][y] === 9 ? prev + 1 : prev - 1));
      setGrid(updatedGrid);
    } else if (grid[x][y] !== 0) {
      var data = getNeighbors(x,y, grid);
      if (grid[x][y] <= data.flags) // dig around known cell
        data.neighbors.forEach(cell => socket.emit("revealCell", { x:cell[0], y:cell[1] } ));
    }
  };

  return { grid, setGrid, dig, toggleDig, handleClick, placeFlags, remainingCells };
};

export default useGameLogic;
