import { addPlayer, getAllPlayers, getPlayer, setPlayerEliminated, incrPlayerLevel } from "./players";
import { Game, generateGame, getCells } from "./games";

type Games = Game[];
let games: Games = [];

function startGame(playerId: string) {
  if (games.length === 0){
    games.push(generateGame(games.length));
  }
  addPlayer(playerId);
  return { grid: [...getGame(0).grid], players: getAllPlayers() };
}

function revealCell(playerId: string, x: number, y: number) {
  var level = getPlayer(playerId).level;
  var bombs = games[level].bombs;
  var solvedGrid = games[level].solveGrid;
  if (bombs.has(`${x},${y}`)) {
    setPlayerEliminated(playerId);
    return { eliminated: true, playerId };
  }
  return { cells: getCells(solvedGrid,x,y) };
}

function goToNextLevel(playerId: string, lastCells: String[]) {
  var level = getPlayer(playerId).level;
  var bombs = games[level].bombs;
  var cells = new Set<String>(lastCells);
  if (bombs.size !== cells.size) return {win: false};
  bombs.forEach(cell => {
    if (!cells.has(cell)) return {win: false}
  });
  incrPlayerLevel(playerId);
  var newLevel = getPlayer(playerId).level;
  console.log(newLevel, games.length)
  gameExist(newLevel);
  return {win: true, grid: getGame(newLevel).grid};
}

function gameExist(level: number) {
  if (level < games.length) return;
  games.push(generateGame(games.length));
}

function getGame(level: number) {
  if (level < 0 || level >= games.length ) {
    console.warn("Error level game select", level, games.length);
    return games[0];
  }
  return games[level];
}

module.exports = { startGame, revealCell, goToNextLevel };