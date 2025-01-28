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
    match.games[match.curLevel].closingTime = Date.now();
    match.curLevel++;
    match.games.push(generateGame(match.curLevel));
}

export function incrPlayerToNextLevel(match: Match, playerId: string) {
    incrPlayerLevel(match.players, playerId);
}

export function isMatchReadyToStart(match: Match) {
    return match.nbPlayers === NB_PLAYER_PER_MATCH;
}

export function checkTimeouts(match: Match) { // TODO: optimize this
    match.games.forEach(game => {
        if (game.closingTime > 0) {
            const elapsedTime = (Date.now() - game.closingTime) / 1000;
            if (elapsedTime > game.timer) { 
                Object.keys(match.players).forEach(playerId => {
                    var player = getPlayer(match.players, playerId);
                    if (!player.eliminated && player.level === game.id) {
                        setPlayerEliminated(match.players, playerId);
                    }
                });
            }
        }
    })
}
