import React, { useEffect, useState } from "react";
import { Stage, Graphics } from "@pixi/react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const CELL_SIZE = 30;
const GRID_SIZE = 10;

const GameBoard = () => {
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0)));

  useEffect(() => {
    socket.on("gameState", (data) => setGrid(data.grid));
    socket.on("gameUpdate", (data) => {
      if (data.eliminated) {
        alert("You lost!");
      } else {
        setGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          newGrid[data.x][data.y] = data.value;
          return newGrid;
        });
      }
    });
  }, []);

  const handleClick = (x, y) => {
    socket.emit("revealCell", { x, y });
  };

  return (
    <Stage width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE}>
      {grid.map((row, x) =>
        row.map((cell, y) => (
          <Graphics
            key={`${x}-${y}`}
            draw={(g) => {
              g.clear();
              g.beginFill(cell === 0 ? 0xcccccc : 0xffffff);
              g.drawRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
              g.endFill();
            }}
            interactive
            pointerdown={() => handleClick(x, y)}
          />
        ))
      )}
    </Stage>
  );
};

export default GameBoard;