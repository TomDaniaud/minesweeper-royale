import React, { useEffect, useState } from "react";
import { Stage, Graphics, Text } from "@pixi/react";
import "@pixi/events";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const CELL_SIZE = 30;
const GRID_SIZE = 10;

const GameBoard = () => {
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(-1)));
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
          newGrid[data.x][data.y] = data.value;
          console.log(newGrid)
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
    socket.emit("revealCell", { x, y });
  };

  return (
    <Stage width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE}>
      {grid.map((row, x) =>
        row.map((cell, y) => (
          <React.Fragment key={`${x}-${y}`}>
            <Graphics
              draw={(g) => {
                g.clear();
                g.beginFill(cell === -1 ? 0xcccccc : 0xffffff); // Couleur de la cellule
                g.drawRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                g.endFill();

                // Ajout de la bordure noire
                g.lineStyle(1, 0x000000);
                g.drawRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
              }}
              interactive
              pointerdown={() => handleClick(x, y)}
            />
            {!(cell === -1 || cell === 0) && (
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
  );
};

export default GameBoard;