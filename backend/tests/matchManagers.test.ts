import { config, Grid } from "../src/config/constants";
import { this.matchs, this.playerAssigment, clearMatchs, findMatch, leaveMatch, startMatch, canLaunchMatch, havePlayerWinGame, playPlayerAction, getFirstGame } from "../src/matchManagers";

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

    beforeEach(() => {
        clearMatchs();
    });

    test("Find a match for a player", () => {
        var ret = findMatch("123", "test");
        expect(ret).toBe(this.matchs[0]);
        expect(this.matchs.length).toEqual(1);
        expect(this.playerAssigment["123"]).toEqual(0);
        expect(this.matchs[0].nbPlayers).toEqual(1);

        ret = findMatch("123", "test");
        expect(ret).toEqual(undefined);
        expect(this.matchs.length).toEqual(1);
        expect(this.playerAssigment["123"]).toEqual(0);
        expect(this.matchs[0].nbPlayers).toEqual(1);

        this.matchs[0].launch = true;
        ret = findMatch('456', 'test2');
        expect(ret).toBe(this.matchs[1]);
        expect(this.matchs.length).toEqual(2);
        expect(this.playerAssigment["456"]).toEqual(1);
    });

    test("Removes player from his current match", () => {
        var ret = leaveMatch("123");
        expect(ret).toEqual({ error: 'NO_MATCH' });

        this.playerAssigment['123'] = 9;
        ret = leaveMatch("123");
        expect(ret).toEqual({ error: 'NO_MATCH' });

        findMatch("123", "test");
        ret = leaveMatch("123");
        expect(ret).toEqual({ match: this.matchs[0] });
        expect(this.playerAssigment["123"]).toEqual(undefined);
        expect(this.matchs[0].nbPlayers).toEqual(0);
    });

    test("Start a match", () => {
        var ret = startMatch(0);
        expect(ret).toEqual({ error: 'NO_MATCH' });

        findMatch("123", "test");
        ret = startMatch(0);
        expect(this.matchs[0].launch).toEqual(true);
        expect(ret).toEqual({ roomId: 0 });
    });

    test("Check if a match can be launch", () => {
        var ret = canLaunchMatch(0);
        expect(ret).toEqual({ error: 'NO_MATCH' });

        findMatch("123", "test");
        ret = canLaunchMatch(0);
        expect(ret).toEqual(false);

        for (let i = 0; i < config.NB_PLAYER_PER_MATCH - 1; i++) {
            findMatch(`${i}`, `test${i}`);
        }
        ret = canLaunchMatch(0);
        expect(ret).toEqual(true);

        startMatch(0);
        ret = canLaunchMatch(0);
        expect(ret).toEqual(false);

    });

    test("Check if a player win a game", () => {
        var ret = havePlayerWinGame("123", []);
        expect(ret).toEqual({ error: 'NO_MATCH' });

        this.playerAssigment['123'] = 9;
        ret = havePlayerWinGame("123", []);
        expect(ret).toEqual({ error: 'NO_MATCH' });

        findMatch('123', 'test');
        startMatch(0);
        ret = havePlayerWinGame("123", []);
        expect(ret).toEqual({ win: false });

        var bombs: string[] = Array.from(this.matchs[0].games[0].bombs);
        ret = havePlayerWinGame("123", bombs);
        expect(ret).toEqual({ win: true, grid: this.matchs[0].games[1].grid });

        this.matchs[0].players['123'].eliminated = true;
        ret = havePlayerWinGame('123', []);
        expect(ret).toEqual({ eliminated: true });
    });

    test("Make the player action", () => {
        var ret = playPlayerAction("123", 0, 0);
        expect(ret).toEqual({ error: 'NO_MATCH' });

        this.playerAssigment['123'] = 9;
        ret = playPlayerAction("123", 0, 0);
        expect(ret).toEqual({ error: 'NO_MATCH' });

        findMatch('123', 'test');
        startMatch(0);

        const originalValue = config.GRID_SIZE;
        (config as any).GRID_SIZE = 4;
        this.matchs[0].games[0].bombs = bombs;
        this.matchs[0].games[0].grid = grid;
        this.matchs[0].games[0].solvedGrid = solvedGrid;

        ret = playPlayerAction("123", 3, 0);
        expect(ret).toEqual({ cells: [{ x: 3, y: 0, value: 1 }] })

        ret = playPlayerAction('123', 0, 0);
        expect(ret).toEqual({ eliminated: true });
        expect(this.playerAssigment).not.toHaveProperty('123');
        expect(this.matchs[0].players['123'].eliminated).toEqual(true);

        config.GRID_SIZE = originalValue;
    });

    test("Get the firt game of the match", () => {
        var ret = getFirstGame("123");
        expect(ret).toEqual({ error: 'NO_MATCH' });

        this.playerAssigment['123'] = 9;
        ret = getFirstGame("123");
        expect(ret).toEqual({ error: 'NO_MATCH' });

        findMatch('123', 'test');
        startMatch(0);

        const originalValue = config.NB_BOMBS;
        (config as any).NB_BOMBS = 2;
        this.matchs[0].games[0].bombs = bombs;
        this.matchs[0].games[0].grid = grid;
        this.matchs[0].games[0].solvedGrid = solvedGrid;
        var ret = getFirstGame("123");
        expect(ret).toEqual({ grid: grid, nb_bombs: 2 })

        config.NB_BOMBS = originalValue;
    });
});