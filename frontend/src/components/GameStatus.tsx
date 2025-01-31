import React from "react";
import { NB_BOMBS } from "../hooks/useGameLogic";

const GameStatus = ({ placeFlags: placedFlags, remainingCells }: { placeFlags: number, remainingCells: number }) => {
  return (
    <div className="game-status">
      <p>💣 Bombs: {NB_BOMBS - placedFlags}</p>
      <p>🔳 Cells: {remainingCells}</p>
    </div>
  );
};

export default GameStatus;
