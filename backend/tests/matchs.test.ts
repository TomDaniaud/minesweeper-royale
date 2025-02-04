import Match from "../src/gamelogic/matchs"
import { config } from "../src/config/constants";
import { Player } from "../src/gamelogic/players";

describe('Matchs module', () => {
    let match: Match;

    beforeEach(() => {
        match = new Match(0);
    });

    test("Create a match", () => {
        expect({
            id: match.id,
            games: match.games,
            players: match.players.getAll(),
            nbPlayers: match.players.length,
            curLevel: match.curLevel,
            launch: match.launch,
        }).toEqual({
            id: 0,
            games: match.games,
            players: {},
            nbPlayers: 0,
            curLevel: 0,
            curLevel: 0,
            launch: false,
        });
        expect(match.games.length).toEqual(1);
    });

    test("Add a player in match", () => {
        match.addPlayer("aze", "test");
        expect(match.players.get("aze")).toEqual(new Player("test", match.curLevel));
        expect(match.players.length).toEqual(1);
    });

    test("Remove a player from a match", () => {
        match.addPlayer("aze", "test");
        match.removePlayer("aze");
        expect(match.players.getAll()).toEqual({});
        expect(match.players.length).toEqual(0);

        match.removePlayer("aze");
        expect(match.players.getAll()).toEqual({});
        expect(match.players.length).toEqual(0);
    });

    test("Increase match level", () => {
        match.incrToNextLevel();
        expect(match.curLevel).toEqual(1);
        expect(match.games.length).toEqual(2);
        expect(match.games[0].closingTime).toBeGreaterThan(0);
    });

    test("Move player to the next level", () => {
        match.incrPlayerToNextLevel("aze");

        match.addPlayer("aze", "test");
        match.incrPlayerToNextLevel("aze");
    });

    test("Check if a match is ready to start", () => {
        expect(match.isReadyToStart()).toEqual(false);

        for (let i = 0; i < config.NB_PLAYER_PER_MATCH; i++) {
            match.addPlayer(`${i}`, `test${i}`);
        }
        expect(match.isReadyToStart()).toEqual(true);
    });

    test("Check if a game is timeout to eliminate player", () => {
        match.addPlayer("123", "test1");
        match.addPlayer("456", "test2");
        match.checkTimeouts();
        expect(match.players.get('123').eliminated).toEqual(false);
        expect(match.players.get('456').eliminated).toEqual(false);

        match.incrPlayerToNextLevel('123');
        match.incrToNextLevel();
        match.games[0].closingTime = 1; // to simulate a long periode of time
        match.checkTimeouts();
        expect(match.players.get('123').eliminated).toEqual(false);
        expect(match.players.get('456').eliminated).toEqual(true);
    });
});
