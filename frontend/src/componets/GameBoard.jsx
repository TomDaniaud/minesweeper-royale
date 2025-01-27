import React from "react";
import { Stage, Graphics } from "@pixi/react";
import useSocket from "../hooks/useSocket";
import useGameLogic from "../hooks/useGameLogic";
import Cell from "./Cell";
import GameStatus from "./GameStatus";
import { GRID_SIZE, CELL_SIZE } from "../config/constants";

const GameBoard = () => {
  const { grid, setGrid, dig, toggleDig, handleClick, placeFlags, remainingCells } = useGameLogic(
    Array(10).fill().map(() => Array(10).fill(-1))
  );

  const socket = useSocket(setGrid);

  return (
    <div className="game-board">
      <GameStatus placeFlags={placeFlags} remainingCells={remainingCells} />
      <button onClick={toggleDig}>{dig ? "🔨 Creuser" : "🚩 Drapeau"}</button>
      <Stage width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE}>
        {grid.map((row, x) =>
          row.map((cell, y) => (
            <Cell key={`${x}-${y}`} x={x} y={y} cellValue={cell} onClick={() => handleClick(x, y, socket)} />
          ))
        )}
      </Stage>
    </div>
  );
};

export default GameBoard;
