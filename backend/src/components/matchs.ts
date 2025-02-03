import { config } from "../config/constants";
import Game from "./games";
import PlayerHandler from "./players";

type Games = Game[];

export default class Match {
    id: number;
    games: Games;
    players: PlayerHandler;
    curLevel: number;
    launch: boolean;

    constructor(id: number) {
        this.id = id;
        this.games = [];
        this.players = new PlayerHandler();
        this.curLevel = 0;
        this.launch = false;
        this.games.push(new Game(this.curLevel));
    }

    public getGame(level: number): Game | undefined {
        return this.games[level]
    }


    public addPlayerInMatch(playerId: string, playerName: string) {
        if (this.players.getPlayer(playerId) !== undefined)
            return;
        this.players.addPlayer(playerId, playerName, this.id);
    }

    public removePlayerInMatch(playerId: string) {
        if (this.players.getPlayer(playerId) === undefined)
            return;
        this.players.removePlayer(playerId);
    }

    public incrToNextLevel() {
        this.games[this.curLevel].closingTime = Date.now();
        this.curLevel++;
        this.games.push(new Game(this.curLevel));
    }

    public incrPlayerToNextLevel(playerId: string) {
        if (this.players.getPlayer(playerId) === undefined)
            return;
        this.players.incrPlayerLevel(playerId);
    }

    public isMatchReadyToStart() {
        return this.players.nbPlayer === config.NB_PLAYER_PER_MATCH && this.launch === false;
    }

    /**
     * Check if games for a match is timeout to eliminate player at this level.
     */
    public checkTimeouts() { // TODO: optimize this
        this.games.forEach(game => {
            if (game.closingTime > 0) {
                const elapsedTime = (Date.now() - game.closingTime) / 1000;
                if (elapsedTime > game.timer) {
                    Object.keys(this.players.getAllPlayers()).forEach(playerId => {
                        var player = this.players.getPlayer(playerId);
                        if (!player.eliminated && player.level === game.id) {
                            this.players.setPlayerEliminated(playerId);
                        }
                    });
                }
            }
        })
    }
}
