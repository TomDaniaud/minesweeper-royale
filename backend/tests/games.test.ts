import Game, { Bombs } from "../src/gamelogic/games"
import { TIMER_EVOLUTION, Grid, config } from "../src/config/constants";

describe("Games module", () => {
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

    let bombs: Bombs = new Set(['0,0', '2,1'])

    let game: Game = new Game(0);
    game.bombs = bombs;
    game.solvedGrid = solvedGrid;
    game.grid = grid;

    test("Generate a game", () => {
        expect(game).toEqual({
            id: 0,
            grid: game.grid,
            solveGrid: game.solvedGrid,
            bombs: game.bombs,
            timer: TIMER_EVOLUTION[0],
            closingTime: 0,
        });
        game.id = 9;
        expect(game).toEqual({
            id: 9,
            grid: game.grid,
            solveGrid: game.solvedGrid,
            bombs: game.bombs,
            timer: 1,
            closingTime: 0,
        });
    });

    test("Check if a game is win", () => {
        expect(game.isWin(['0,0', '1,1', '2,1'])).toEqual(false);
        expect(game.isWin(['0,0', '1,1'])).toEqual(false);
        expect(game.isWin([])).toEqual(false);
        expect(game.isWin(['0,0', '2,1'])).toEqual(true);
    });

    test("Reveal list of cells after clicking at (x, y)", () => {
        const originalValue = config.GRID_SIZE;
        (config as any).GRID_SIZE = 4;
        expect(game.revealCells(0, 0)).toEqual([]);
        expect(game.revealCells(2, 2)).toEqual([{ x: 2, y: 2, value: 1 }]);
        expect(game.revealCells(3, 3)).toEqual([{ "value": 0, "x": 3, "y": 3 },
        { "value": 0, "x": 2, "y": 3 },
        { "value": 0, "x": 1, "y": 3 },
        { "value": 0, "x": 0, "y": 3 },
        { "value": 1, "x": 1, "y": 2 },
        { "value": 0, "x": 0, "y": 2 },
        { "value": 2, "x": 1, "y": 1 },
        { "value": 1, "x": 0, "y": 1 },
        { "value": 1, "x": 2, "y": 2 },
        { "value": 1, "x": 3, "y": 2 }
        ]);
        expect(game.revealCells(9, 9)).toEqual([]);
        expect(game.revealCells(-1, -1)).toEqual([]);

        config.GRID_SIZE = originalValue;
    });

    test("Count the neighbors around a cell", () => {
        expect(game.countNeighbors(3, 3)).toEqual(0);
        expect(game.countNeighbors(0, 0)).toEqual(9);
        expect(game.countNeighbors(1, 1)).toEqual(2);
        expect(game.countNeighbors(0, 1)).toEqual(1);
    });
});