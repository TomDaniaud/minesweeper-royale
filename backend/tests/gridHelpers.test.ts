import { countNeighbors } from "../src/utils/gridHelpers";
import { Grid } from "../src/config/constants";

describe("Games module", () => {
    let solvedGrid: Grid = [[9, 1, 0, 0],
                            [2, 2, 1, 0],
                            [1, 9, 1, 0],
                            [1, 1, 1, 0]
                        ]

    let bombs: Set<string> = new Set(['0,0', '2,1'])

    test("Count the neighbors around a cell", () => {
        expect(countNeighbors(3,3, bombs)).toEqual(0);
        expect(countNeighbors(0,0, bombs)).toEqual(9);
        expect(countNeighbors(1,1, bombs)).toEqual(2);
        expect(countNeighbors(0,1, bombs)).toEqual(1);
    });
});