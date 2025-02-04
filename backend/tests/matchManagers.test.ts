import { config, Grid } from "../src/config/constants";
import Game from "../src/gamelogic/games";
import MatchHandler from "../src/matchManagers";

describe("Match Managers module", () => {
    let grid: Grid = [[-1, 1, 0, 0],
    [-1, 1, 1, 0],
    [-1, -1, 1, 0],
    [-1, -1, 1, 0]
    ]
    let solvedGrid: Grid = [[9, 1, 0, 0],
    [2, 2, 1, 0],
    [1, 9, 1, 0],
    [1, 1, 1, 0]
    ]

    let bombs: Set<string> = new Set(['0,0', '2,1'])

    let game: Game = new Game(0);
    game.bombs = bombs;
    game.solvedGrid = solvedGrid;
    game.grid = grid;

    let matchHandler = new MatchHandler();

    beforeEach(() => {
        matchHandler.clearMatchs();
    });

    test("Find a match for a player", () => {
        var ret = matchHandler.joinMatch("123", "test");
        expect(ret).toBe(matchHandler.matchs[0]);
        expect(matchHandler.matchs.length).toEqual(1);
        expect(matchHandler.playerAssigment["123"]).toEqual(0);
        expect(matchHandler.matchs[0].players.length).toEqual(1);

        ret = matchHandler.joinMatch("123", "test");
        expect(ret).toEqual(undefined);
        expect(matchHandler.matchs.length).toEqual(1);
        expect(matchHandler.playerAssigment["123"]).toEqual(0);
        expect(matchHandler.matchs[0].players.length).toEqual(1);

        matchHandler.matchs[0].launch = true;
        ret = matchHandler.joinMatch('456', 'test2');
        expect(ret).toBe(matchHandler.matchs[1]);
        expect(matchHandler.matchs.length).toEqual(2);
        expect(matchHandler.playerAssigment["456"]).toEqual(1);
    });

    test("Removes player from his current match", () => {
        var ret = matchHandler.leaveMatch("123");
        expect(ret).toEqual({ error: 'NO_MATCH' });

        matchHandler.playerAssigment['123'] = 9;
        ret = matchHandler.leaveMatch("123");
        expect(ret).toEqual({ error: 'NO_MATCH' });

        matchHandler.joinMatch("123", "test");
        ret = matchHandler.leaveMatch("123");
        expect(ret).toEqual({ match: matchHandler.matchs[0] });
        expect(matchHandler.playerAssigment["123"]).toEqual(undefined);
        expect(matchHandler.matchs[0].players.length).toEqual(0);
    });

    test("Start a match", () => {
        var ret = matchHandler.startMatch(0);
        expect(ret).toEqual({ error: 'NO_MATCH' });

        matchHandler.joinMatch("123", "test");
        ret = matchHandler.startMatch(0);
        expect(matchHandler.matchs[0].launch).toEqual(true);
        expect(ret).toEqual({ roomId: 0 });
    });

    test("Check if a match can be launch", () => {
        var ret = matchHandler.canLaunchMatch(0);
        expect(ret).toEqual({ error: 'NO_MATCH' });

        matchHandler.joinMatch("123", "test");
        ret = matchHandler.canLaunchMatch(0);
        expect(ret).toEqual(false);

        for (let i = 0; i < config.NB_PLAYER_PER_MATCH - 1; i++) {
            matchHandler.joinMatch(`${i}`, `test${i}`);
        }
        ret = matchHandler.canLaunchMatch(0);
        expect(ret).toEqual(true);

        matchHandler.startMatch(0);
        ret = matchHandler.canLaunchMatch(0);
        expect(ret).toEqual(false);

    });

    test("Check if a player win a game", () => {
        var ret = matchHandler.hasPlayerWinGame("123", []);
        expect(ret).toEqual({ error: 'NO_MATCH' });

        matchHandler.playerAssigment['123'] = 9;
        ret = matchHandler.hasPlayerWinGame("123", []);
        expect(ret).toEqual({ error: 'NO_MATCH' });

        matchHandler.joinMatch('123', 'test');
        matchHandler.startMatch(0);
        ret = matchHandler.hasPlayerWinGame("123", []);
        expect(ret).toEqual({ win: false });

        var bombs: string[] = Array.from(matchHandler.matchs[0].games[0].bombs);
        ret = matchHandler.hasPlayerWinGame("123", bombs);
        expect(ret).toEqual({ win: true, grid: matchHandler.matchs[0].games[1].grid });

        matchHandler.matchs[0].players.get('123').eliminated = true;
        ret = matchHandler.hasPlayerWinGame('123', []);
        expect(ret).toEqual({ eliminated: true });
    });

    test("Make the player action", () => {
        var ret = matchHandler.playPlayerAction("123", 0, 0);
        expect(ret).toEqual({ error: 'NO_MATCH' });

        matchHandler.playerAssigment['123'] = 9;
        ret = matchHandler.playPlayerAction("123", 0, 0);
        expect(ret).toEqual({ error: 'NO_MATCH' });

        matchHandler.joinMatch('123', 'test');
        matchHandler.startMatch(0);

        const originalValue = config.GRID_SIZE;
        (config as any).GRID_SIZE = 4;
        matchHandler.matchs[0].games[0].bombs = bombs;
        matchHandler.matchs[0].games[0].grid = grid;
        matchHandler.matchs[0].games[0].solvedGrid = solvedGrid;

        ret = matchHandler.playPlayerAction("123", 3, 0);
        expect(ret).toEqual({ cells: [{ x: 3, y: 0, value: 1 }] })

        ret = matchHandler.playPlayerAction('123', 0, 0);
        expect(ret).toEqual({ eliminated: true });
        expect(matchHandler.playerAssigment).not.toHaveProperty('123');
        expect(matchHandler.matchs[0].players.get('123').eliminated).toEqual(true);

        config.GRID_SIZE = originalValue;
    });

    test("Get the firt game of the match", () => {
        var ret = matchHandler.getFirstGame("123");
        expect(ret).toEqual({ error: 'NO_MATCH' });

        matchHandler.playerAssigment['123'] = 9;
        ret = matchHandler.getFirstGame("123");
        expect(ret).toEqual({ error: 'NO_MATCH' });

        matchHandler.joinMatch('123', 'test');
        expect(matchHandler.startMatch(0)).toEqual({ roomId: 0 });

        const originalValue = config.NB_BOMBS;
        (config as any).NB_BOMBS = 2;
        matchHandler.matchs[0].games[0].bombs = bombs;
        matchHandler.matchs[0].games[0].grid = grid;
        matchHandler.matchs[0].games[0].solvedGrid = solvedGrid;
        var ret = matchHandler.getFirstGame("123");
        expect(ret).toEqual({ grid: grid, nb_bombs: 2 })

        config.NB_BOMBS = originalValue;
    });
});