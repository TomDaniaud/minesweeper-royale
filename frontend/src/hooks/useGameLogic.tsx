import { useState, useEffect } from "react";
import { countFlags, countRemainingCells, getNeighbors, getRemainingCells, } from "../utils/gridHelpers";
import { Socket } from "socket.io-client";
import { initialGameState, ResultEndGame, ResultOnReveal, XY } from "../config/types";

export let NB_BOMBS = -1;

const useGameLogic = (initialGrid: Array<Array<number>>, socket: Socket) => {
  const [grid, setGrid] = useState(initialGrid);
  const [dig, setDig] = useState(true);
  const [placedFlags, setFlags] = useState(countFlags(initialGrid));
  const [remainingCells, setRemaining] = useState(countRemainingCells(initialGrid));

  useEffect(() => {
    setRemaining(countRemainingCells(grid));
    setFlags(countFlags(grid));
  }, [grid]);

  useEffect(() => {
    if (remainingCells === NB_BOMBS) isGridFinish();
  }, [remainingCells]);

  useEffect(() => {
    if (!socket) return;

    socket.on("gameState", (data: initialGameState) => {
      if (data.error === "NO_MATCH") {
        console.warn("No match assigned! Redirecting...");
        window.location.href = "/";
      } else if (data.grid) {
        setGrid([...data.grid.map(row => [...row])]);
        NB_BOMBS = data.nb_bombs!;    // #TODO: verify if data.nb_bombs is not null

      }
    });

    socket.on("gameUpdate", (data: ResultOnReveal) => {
      if (data.error === "NO_MATCH") {
        console.warn("No match assigned! Redirecting...");
        window.location.href = "/";
      } else if (data.eliminated) {
        alert("You lost !!");
      } else if (data.cells) {
        setGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          data.cells.forEach(cell => (newGrid[cell.x][cell.y] = cell.value));
          return newGrid;
        });
      }

      socket.on("gameStatus", (data: ResultEndGame) => {
        if (data.error === "NO_MATCH") {
          console.warn("No match assigned! Redirecting...");
          window.location.href = "/";
        } else if (data.eliminated) {
          alert("You lost !!");
        } else if (data.win && data.grid) {
          // alert('You win !!')
          setGrid([...data.grid.map(row => [...row])]);
        }
      });
    });

    return () => {
      socket.off("gameState");
      socket.off("gameUpdate");
      socket.off("gameStatus");
    };
  }, [socket]);

  const toggleDig = () => setDig((prev) => !prev);

  const handleClick = ({ x, y }: XY): void => {
    if (dig && grid[x][y] === -1) {  // unknown cell
      socket.emit("revealCell", { x, y });
    } else if (!dig && (grid[x][y] === -1 || grid[x][y] === 9)) { // place or remove flag
      const updatedGrid = [...grid];
      updatedGrid[x][y] = updatedGrid[x][y] === -1 ? 9 : -1;
      setGrid(updatedGrid);
    } else if (grid[x][y] !== 0) {
      var data = getNeighbors({ x, y }, grid);
      if (grid[x][y] <= data.flags) // dig around known cell
        data.neighbors.forEach(cell => socket.emit("revealCell", { x: cell[0], y: cell[1] }));
    }
  };

  const isGridFinish = () => {
    socket.emit("isGridValid", { cells: getRemainingCells(grid) });
  }

  return { grid, dig, toggleDig, handleClick, placedFlags, remainingCells };
};

export default useGameLogic;
