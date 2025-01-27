export interface Player {
  level: number;
  progress: number;
  eliminated: boolean;
}

let playerList: Record<string, Player>  = {};

export function addPlayer(id: string) {
  playerList[id] = { level: 0, progress: 0, eliminated: false };
}

export function removePlayer(id: string) {
  delete playerList[id];
}

export function getAllPlayers() {
  return playerList;
}

export function getPlayer(id: string) {
  return playerList[id];
}

export function setPlayerEliminated(id: string) {
  playerList[id].eliminated = true;
}

export function incrPlayerLevel(id: string) {
  playerList[id].level++;
}