class Player {
  name: string;
  matchId: number;
  level: number;
  progress: number;
  eliminated: boolean;

  constructor(name: string, matchId: number) {
    this.name = name;
    this.matchId = matchId;
    this.level = 0;
    this.progress = 0;
    this.eliminated = false;
  }
};

export class PlayerHandler {
  name: string;
  players: Record<string, Player>;

  constructor(name: string) {
    this.name = name;
    this.players = {};
  }

  public addPlayer(id: string, name: string, matchId: number) {
    this.players[id] = new Player(name, matchId);
  }

  public removePlayer(id: string) {
    delete this.players[id];
  }

  public getAllPlayers() {
    return this.players;
  }

  public getPlayer(id: string) {
    return this.players[id];
  }

  public setPlayerEliminated(id: string) {
    if (this.players[id] === undefined)
      return;
    this.players[id].eliminated = true;
  }

  public incrPlayerLevel(id: string) {
    if (this.players[id] === undefined)
      return;
    this.players[id].level++;
    this.players[id].progress = 0;
  }

}