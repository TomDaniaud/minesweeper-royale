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

export default class PlayerHandler {
  nbPlayer: number
  players: Record<string, Player>;

  constructor() {
    this.nbPlayer = 0;
    this.players = {};
  }

  public addPlayer(id: string, name: string, matchId: number) {
    this.players[id] = new Player(name, matchId);
    this.nbPlayer++;
  }

  public removePlayer(id: string) {
    delete this.players[id];
    this.nbPlayer--;
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