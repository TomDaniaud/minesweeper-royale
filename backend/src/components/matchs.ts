import { config } from "../config/constants";
import Game from "./games";
import { Players, addPlayer, getPlayer, incrPlayerLevel, removePlayer, setPlayerEliminated } from "./players";

type Games = Game[];

export class Match {
    id: number;
    games: Games;
    players: Players;
    nbPlayers: number
    curLevel: number;
    launch: boolean;

    constructor(id: number) {
        this.id = id;
        this.games = [];
        this.players = {};
        this.curLevel = 0;
        this.nbPlayers = 0;
        this.launch = false;
        this.games.push(new Game(this.curLevel));
    }


    public addPlayerInMatch(match: Match, playerId: string, playerName: string) {
        if (match.players[playerId] !== undefined)
            return;
        addPlayer(match.players, playerId, playerName, match.id);
        match.nbPlayers++;
    }

    public removePlayerInMatch(match: Match, playerId: string) {
        if (match.players[playerId] === undefined)
            return;
        removePlayer(match.players, playerId);
        match.nbPlayers--;
    }

    public incrToNextLevel(match: Match) {
        match.games[match.curLevel].closingTime = Date.now();
        match.curLevel++;
        match.games.push(new Game(match.curLevel));
    }

    public incrPlayerToNextLevel(match: Match, playerId: string) {
        if (match.players[playerId] === undefined)
            return;
        incrPlayerLevel(match.players, playerId);
    }

    public isMatchReadyToStart(match: Match) {
        return match.nbPlayers === config.NB_PLAYER_PER_MATCH;
    }

    /**
     * Check if games for a match is timeout to eliminate player at this level.
     */
    public checkTimeouts(match: Match) { // TODO: optimize this
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
}
