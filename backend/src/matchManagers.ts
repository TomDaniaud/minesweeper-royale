import { getPlayer, setPlayerEliminated } from "./components/players";
import { isGameWin, revealCells } from "./components/games";
import { Match, addPlayerInMatch, createNewMatch, incrToNextLevel, incrPlayerToNextLevel, isMatchReadyToStart, checkTimeouts, removePlayerInMatch } from "./components/matchs";
import { config } from "./config/constants";

type Matchs = Match[];
export let matchs: Matchs = [];
export let playerAssigment: Record<string, number> = {};

setInterval(() => matchs.forEach(match => checkTimeouts(match)), 1000);

function getPlayerAssignment(playerId: string): number | null {
    if (playerAssigment[playerId] === undefined) {
        console.warn(`ERROR: Player ${playerId} has no match assigned.`);
        return null;
    }
    return playerAssigment[playerId];
}

function getMatch(id: number | null): Match | null {
    if (id === null || id < 0 || id >= matchs.length) {
        console.warn(`ERROR: Invalid match ID: ${id}`);
        return null;
    }
    return matchs[id];
}

/**
 * Find a match to join for a player
 */
export function findMatch(playerId: string, playerName: string) {
    if (matchs.length === 0 || matchs[matchs.length - 1].launch === true)
        matchs.push(createNewMatch(matchs.length));
    if (playerAssigment[playerId] !== undefined && getMatch(playerAssigment[playerId])?.launch === false)
        return;
    addPlayerInMatch(matchs[matchs.length - 1], playerId, playerName);
    playerAssigment[playerId] = matchs.length - 1;
    return matchs[matchs.length - 1];
}

/**
 * Removes player from his current match
 */
export function leaveMatch(playerId: string) {
    const matchId = getPlayerAssignment(playerId);
    if (matchId === null) return { error: "NO_MATCH" };
    const match = getMatch(matchId);
    if (match === null) return { error: "NO_MATCH" };
    removePlayerInMatch(match, playerId);
    delete playerAssigment[playerId];
    return { match };
}

export function startMatch(matchId: number) {
    var match = getMatch(matchId);
    if (match === null) return { error: "NO_MATCH" };
    match.launch = true;
    return { roomId: matchId }
}

export function canLaunchMatch(matchId: number) {
    var match = getMatch(matchId);
    if (match === null) return { error: "NO_MATCH" };
    return isMatchReadyToStart(match) && match.launch === false;
}

export function havePlayerWinGame(playerId: string, lastCells: String[]) {
    const matchId = getPlayerAssignment(playerId);
    if (matchId === null) return { error: "NO_MATCH" };
    const match = getMatch(matchId);
    if (match === null) return { error: "NO_MATCH" };
    var player = getPlayer(match.players, playerId);
    if (player.eliminated)
        return { eliminated: true };
    var level = player.level;
    var win = isGameWin(match.games[level].bombs, lastCells);
    if (!win)
        return { win: false };
    if (match.curLevel === level)
        incrToNextLevel(match);
    incrPlayerToNextLevel(match, playerId);
    return { win: true, grid: match.games[match.curLevel].grid };
}

export function playPlayerAction(playerId: string, x: number, y: number) {
    const matchId = getPlayerAssignment(playerId);
    if (matchId === null) return { error: "NO_MATCH" };
    const match = getMatch(matchId);
    if (match === null) return { error: "NO_MATCH" };
    var player = getPlayer(match.players, playerId);
    var game = match.games[player.level];
    var cells = revealCells(game.bombs, game.solvedGrid, x, y);
    if (cells.length === 0 || player.eliminated === true) { // Player lost
        delete playerAssigment[playerId];
        setPlayerEliminated(match.players, playerId);
        return { eliminated: true };
    }
    return { cells };
}

export function getFirstGame(playerId: string) {
    const matchId = getPlayerAssignment(playerId);
    if (matchId === null) return { error: "NO_MATCH" };
    const match = getMatch(matchId);
    if (match === null) return { error: "NO_MATCH" };
    return { grid: match.games[0].grid, nb_bombs: config.NB_BOMBS };
}

/**
 * Clear the variable for the tests
 */
export function clearMatchs() {
    matchs = [];
    playerAssigment = {};
}