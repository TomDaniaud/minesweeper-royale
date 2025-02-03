export class Player {
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
  nb: number
  players: Record<string, Player>;

  constructor() {
    this.nb = 0;
    this.players = {};
  }

  public add(idPlayer: string, namePlayeur: string, matchId: number) {
    this.players[idPlayer] = new Player(namePlayeur, matchId);
    this.nb++;
  }

  public remove(idPlayer: string) {
    if (!this.nb) return;
    delete this.players[idPlayer];
    this.nb--;
  }

  public getAll() {
    return this.players;
  }

  public get(idPlayer: string) {
    return this.players[idPlayer];
  }

  public setEliminated(idPlayer: string) {
    if (this.players[idPlayer] === undefined)
      return;
    this.players[idPlayer].eliminated = true;
  }

  public incrLevel(idPlayer: string) {
    if (this.players[idPlayer] === undefined)
      return;
    this.players[idPlayer].level++;
    this.players[idPlayer].progress = 0;
  }

}