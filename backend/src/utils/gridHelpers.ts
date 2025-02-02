import { DIRS } from '../config/constants';

export const countNeighbors = (x: number, y: number, bombs: Set<String>) => {
    if (bombs.has(`${x},${y}`)) {
        return 9;
    }
    var res = 0;
    DIRS.forEach(d => {
        if (bombs.has(`${x + d[0]},${y + d[1]}`)) {
            res++;
        }
    });
    return res;
};
