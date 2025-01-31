import React from "react";
import { Graphics, Text } from "@pixi/react";
import { CELL_SIZE } from "../config/constants";
import "@pixi/events";

const Cell = ({ x, y, cellValue, onClick, onContextMenu}) => {
  return (
    <React.Fragment key={`${x}-${y}`}>
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(cellValue === -1 ? 0xcccccc : cellValue === 9 ? 0xe9962b : 0xffffff);
          g.lineStyle(1, 0x000000);
          g.drawRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          g.endFill();
        }}
        interactive
        pointerdown={onClick}
        rightclick={onContextMenu}
      />
      {!(cellValue === -1 || cellValue === 0 || cellValue === 9) && (
          <Text
            text={cellValue.toString()}
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
  );
};

export default Cell;
