export interface Player {
  name: string;
  match: number;
  level: number;
  progress: number;
  eliminated: boolean;
}

export type Players = Record<string, Player>;

export function addPlayer(players: Players, id: string, name: string, matchId: number) {
  players[id] = {name: name, match: matchId, level: 0, progress: 0, eliminated: false };
}

export function removePlayer(players: Players, id: string) {
  delete players[id];
}

export function getAllPlayers(players: Players) {
  return players;
}

export function getPlayer(players: Players, id: string) {
  return players[id];
}

export function setPlayerEliminated(players: Players, id: string) {
  players[id].eliminated = true;
}

export function incrPlayerLevel(players: Players, id: string) {
  players[id].level++;
  players[id].progress = 0;
}