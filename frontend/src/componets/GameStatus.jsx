import React from "react";

const GameStatus = ({ placeFlags, remainingCells }) => {
  return (
    <div className="game-status">
      <p>🚩 Drapeaux placés : {placeFlags}</p>
      <p>⬜ Cases restantes : {remainingCells}</p>
    </div>
  );
};

export default GameStatus;
