import Match from "./gamelogic/matchs";
import { config } from "./config/constants";


export default class MatchHandler {
    matchs: Match[];
    playerAssigment: Record<string, number>;

    constructor() {
        this.matchs = []
        this.playerAssigment = {}
        setInterval(() => this.matchs.forEach(match => match.checkTimeouts()), 1000);
    }

    public getPlayerAssignment(playerId: string): number | null {
        //return the id of the match if exist
        if (this.playerAssigment[playerId] === undefined) {
            console.warn(`ERROR: Player ${playerId} has no match assigned.`);
            return null;
        }
        return this.playerAssigment[playerId];
    }

    public getMatch(id: number | null): Match | null {
        if (id === null || id < 0 || id >= this.matchs.length) {
            console.warn(`ERROR: Invalid match ID: ${id}`);
            return null;
        }
        return this.matchs[id];
    }

    /**
     * Find a match to join for a player
     */
    public findMatch(playerId: string, playerName: string) {
        if (this.matchs.length === 0 || this.matchs[this.matchs.length - 1].launch === true)
            this.matchs.push(new Match(this.matchs.length));
        if (this.playerAssigment[playerId] !== undefined && this.getMatch(this.playerAssigment[playerId])?.launch === false)
            return;
        this.matchs[this.matchs.length - 1].addPlayer(playerId, playerName);
        this.playerAssigment[playerId] = this.matchs.length - 1;
        return this.matchs[this.matchs.length - 1];
    }

    /**
     * Removes player from his current match
     */
    public leaveMatch(playerId: string) {
        const matchId = this.getPlayerAssignment(playerId);
        if (matchId === null) return { error: "NO_MATCH" };
        const match = this.getMatch(matchId);
        if (match === null) return { error: "NO_MATCH" };
        match.removePlayer(playerId);
        delete this.playerAssigment[playerId];
        return { match };
    }

    public startMatch(matchId: number): { error: string } | { roomId: number } {
        var match = this.getMatch(matchId);
        if (match === null) return { error: "NO_MATCH" };
        match.launch = true;
        return { roomId: matchId }
    }

    public canLaunchMatch(matchId: number): { error: string } | boolean {
        var match = this.getMatch(matchId);
        if (match === null) return { error: "NO_MATCH" };
        return match.isReadyToStart();
    }

    public hasPlayerWinGame(playerId: string, lastCells: String[]) {
        const matchId = this.getPlayerAssignment(playerId);
        if (matchId === null) return { error: "NO_MATCH" };
        const match = this.getMatch(matchId);
        if (match === null) return { error: "NO_MATCH" };
        var player = match.players.get(playerId);
        if (player.eliminated)
            return { eliminated: true };
        var level = player.level;
        const game = match.getGame(level)
        var win = game ? game.isWin(lastCells) : false;
        if (!win)
            return { win: false };
        if (match.curLevel === level)
            match.incrToNextLevel();
        match.incrPlayerToNextLevel(playerId);
        return { win: true, grid: match.getGame(match.curLevel)!.grid };
    }

    public playPlayerAction(playerId: string, x: number, y: number) {
        const matchId = this.getPlayerAssignment(playerId);
        if (matchId === null) return { error: "NO_MATCH" };
        const match = this.getMatch(matchId);
        if (match === null) return { error: "NO_MATCH" };
        var player = match.players.get(playerId);
        var game = match.games[player.level];
        var cells = game.revealCells(x, y);
        if (cells.length === 0 || player.eliminated === true) { // Player lost
            delete this.playerAssigment[playerId];
            match.players.setEliminated(playerId);
            return { eliminated: true };
        }
        return { cells };
    }

    public getFirstGame(playerId: string) {
        const matchId = this.getPlayerAssignment(playerId);
        if (matchId === null) return { error: "NO_MATCH" };
        const match = this.getMatch(matchId);
        if (match === null) return { error: "NO_MATCH" };
        return { grid: match.games[0].grid, nb_bombs: config.NB_BOMBS };
    }

    /**
     * Clear the variable for the tests
     */
    public clearMatchs() {
        this.matchs = [];
        this.playerAssigment = {};
    }

}