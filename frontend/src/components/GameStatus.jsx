import React from "react";
import { NB_BOMBS } from "../config/constants";

const GameStatus = ({ placeFlags, remainingCells }) => {
  return (
    <div className="game-status">
      <p>💣 Bombs: {NB_BOMBS-placeFlags}</p>
      <p>🔳 Cells: {remainingCells}</p>
    </div>
  );
};

export default GameStatus;
