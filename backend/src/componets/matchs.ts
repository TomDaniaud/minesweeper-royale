import { NB_PLAYER_PER_MATCH } from "../config/constants";
import { Game, generateGame } from "./games";
import { Players, addPlayer, getPlayer, incrPlayerLevel, setPlayerEliminated } from "./players";

type Games = Game[];

export interface Match {
    id: number;
    games: Games;
    players: Players;
    nbPlayers: number
    curLevel : number;
    launch: boolean;
}

export function createNewMatch(id: number) {
    var games = [];
    var players = {};
    var curLevel = 0;
    games.push(generateGame(curLevel));
    return {id, games, players, nbPlayers: 0, curLevel, launch: false};
}

export function addPlayerInMatch(match: Match, playerId: string) {
    addPlayer(match.players, playerId, match.id);
    match.nbPlayers++;
}

export function incrToNextLevel(match: Match) {
    match.games[match.curLevel].closingTime = 0; //TODO: add cur time
    match.curLevel++;
    match.games.push(generateGame(match.curLevel));
}

export function incrPlayerToNextLevel(match: Match, playerId: string) {
    var player = getPlayer(match.players, playerId);
    var game = match.games[player.level];
    if (0-game.closingTime > game.timer){ //Player eliminate sol the grid to late
        setPlayerEliminated(match.players, playerId);
        return;
    }
    incrPlayerLevel(match.players, playerId);
}

export function isMatchReadyToStart(match: Match) {
    return match.nbPlayers === NB_PLAYER_PER_MATCH;
}