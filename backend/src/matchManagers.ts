import { getPlayer, setPlayerEliminated } from "./componets/players";
import { isGameWin, revealCells } from "./componets/games";
import { Match, addPlayerInMatch, createNewMatch, incrToNextLevel, incrPlayerToNextLevel, isMatchReadyToStart, checkTimeouts } from "./componets/matchs";

type Matchs = Match[];
let matchs: Matchs = [];
let playerAssign: Record<string, number> = {};

setInterval(() => {
    matchs.forEach(match => checkTimeouts(match));
}, 1000);

function getMatch(id: number) {
    if (id < -1 || id >= matchs.length){
        console.warn('ERROR IN MATCH ID', id, matchs.length-1);
        return matchs[0];
    }
    return matchs[id];
}

export function findMatch(playerId: string) {
    if (matchs.length === 0 || matchs[matchs.length-1].launch === true)
        matchs.push(createNewMatch(matchs.length));
    addPlayerInMatch(matchs[matchs.length-1], playerId);
    playerAssign[playerId] = matchs.length-1;
    return matchs[matchs.length-1];
}

export function startMatch(matchId: number) {
    var match = getMatch(matchId)!;
    match.launch = true;
    return {roomId: matchId}
}

export function canLaunchMatch(matchId: number) {
    var match = getMatch(matchId)!;
    return isMatchReadyToStart(match) && match.launch === false;
}

export function havePlayerWinGame(playerId: string, lastCells: String[]) {
    var match = getMatch(playerAssign[playerId])!;
    var player = getPlayer(match.players, playerId);
    if (player.eliminated)
        return {eliminated: false};
    var level = player.level;
    var win = isGameWin(match.games[level].bombs, lastCells);
    if (!win)
        return {win: false};
    if (match.curLevel === level)
        incrToNextLevel(match);
    incrPlayerToNextLevel(match, playerId);
    return {win: true, grid: match.games[match.curLevel].grid};
}

export function playPlayerAction(playerId: string, x: number, y: number){
    var match = getMatch(playerAssign[playerId]);
    var player = getPlayer(match.players, playerId);
    var game = match.games[player.level];
    var cells = revealCells(game.bombs, game.solveGrid, x, y);
    if (cells.length === 0 || player.eliminated === true) { // Player lost
        setPlayerEliminated(match.players, playerId);
        return { eliminated: true };
    }
    return { cells };
}

export function getFirstGame(playerId: string) {
    return {grid: getMatch(playerAssign[playerId]).games[0].grid};
}