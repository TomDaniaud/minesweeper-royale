export const CELL_SIZE = 30;
export const GRID_SIZE = 10;
export const NB_CELLS = GRID_SIZE * GRID_SIZE;
export const NB_BOMBS = 15;

export const DIRS = [
  [-1, -1], [-1, 0], [-1, 1], 
  [0, -1],           [0, 1], 
  [1, -1], [1, 0], [1, 1],
];

export const CELL_STATES = {
  HIDDEN: -1,
  FLAGGED: 9,
}; // États possibles d'une cellule

export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  GAME_STATE: "gameState",
  GAME_UPDATE: "gameUpdate",
  REVEAL_CELL: "revealCell",
}; // Événements du WebSocket
