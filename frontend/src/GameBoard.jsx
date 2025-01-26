import React, { useEffect, useState } from "react";
import { Stage, Graphics, Text } from "@pixi/react";
import "@pixi/events";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const CELL_SIZE = 30;
const GRID_SIZE = 10;

const GameBoard = () => {
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(-1)));
  const [dig, setDig] = useState(true);

  useEffect(() => {
    console.log("Connecting to WebSocket...");

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection Error: ", err);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socket.on("gameState", (data) => {
      setGrid(data.grid);
    });

    socket.on("gameUpdate", (data) => {
      console.log("Received gameUpdate:", data);
      if (data.eliminated) {
        alert("You lost!");
      } else {
        setGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          data.cells.forEach( cell => {
            newGrid[cell.x][cell.y] = cell.value;
          });
          return newGrid;
        });
      }
    });

    return () => {
      socket.off("gameState");
      socket.off("gameUpdate");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, []);

  const handleClick = (x, y) => {
    if (dig) {
      socket.emit("revealCell", { x, y });
    } else {
      if (grid[x][y] === -1 || grid[x][y] === 9) {
        const updatedGrid = [...grid];
        updatedGrid[x][y] = updatedGrid[x][y] === -1 ? 9 : -1;
        console.log("Updated grid for cell:", x, y, updatedGrid[x][y]);
        setGrid(updatedGrid);
      }
    } 
  };

  const toggleDig = () => {
    setDig((prevState) => !prevState);
  };

  return (
    <div>
      <button onClick={toggleDig} style={{ marginBottom: '10px' }}>
        {dig ? "DIG" : "FLAG"}
      </button>

      <Stage width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE}>
        {grid.map((row, x) =>
          row.map((cell, y) => (
            <React.Fragment key={`${x}-${y}`}>
              <Graphics
                draw={(g) => {
                  g.clear();
                  if (cell === -1){
                    g.beginFill(0xcccccc);
                  } else if (cell === 9){
                    console.log('here')
                    g.beginFill(0xe9962b);
                  } else {
                    g.beginFill(0xffffff);
                  }
                  g.drawRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                  g.endFill();
                  g.lineStyle(1, 0x000000);
                  g.drawRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }}
                interactive
                pointerdown={() => handleClick(x, y)}
              />
              {!(cell === -1 || cell === 0 || cell === 9) && (
                <Text
                  text={cell.toString()}
                  x={x * CELL_SIZE + CELL_SIZE / 2}
                  y={y * CELL_SIZE + CELL_SIZE / 2}
                  anchor={0.5}
                  style={{
                    fontSize: 16,
                    fill: 0x000000,
                    fontWeight: "bold",
                  }}
                />
              )}
            </React.Fragment>
          ))
        )}
      </Stage>
    </div>
  );
};

export default GameBoard;