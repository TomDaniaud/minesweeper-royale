export type initialGameState = {
    grid?: Grid;
    nb_bombs?: number;
    error?: string;
};

export type Bombs = Set<string>;

export type XY = {
    x: number;
    y: number;
};

export type Grid = Cell[][];

export type Game = {
    id: number;
    grid: Grid;
    solveGrid: Grid;
    bombs: Bombs;
    timer: number;
    closingTime: number;
}

export type Cell = {
    x: number;
    y: number;
    value: number;
}

type Result = {
    error?: string;
    eliminated?: boolean;
}

export type ResultOnReveal = Result & {
    cells: Cell[];
}

export type ResultEndGame = Result & {
    win?: boolean;
    grid?: Grid;
}