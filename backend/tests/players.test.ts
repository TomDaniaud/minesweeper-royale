import { Players, addPlayer, removePlayer, getAllPlayers, getPlayer, setPlayerEliminated, incrPlayerLevel } from "../src/components/players";

describe("Players module", () => {
  let players: Players;

  beforeEach(() => {
    players = {};
  });

  test("Add a player", () => {
    addPlayer(players, "123", "Alice", 1);

    expect(players).toHaveProperty("123");
    expect(players["123"]).toEqual({
      name: "Alice",
      match: 1,
      level: 0,
      progress: 0,
      eliminated: false,
    });
  });

  test("Remove a player", () => {
    addPlayer(players, "123", "Alice", 1);
    removePlayer(players, "123");

    expect(players).not.toHaveProperty("123");
  });

  test("Get all players", () => {
    addPlayer(players, "123", "Alice", 1);
    addPlayer(players, "456", "Bob", 2);

    expect(getAllPlayers(players)).toEqual(players);
  });

  test("Get specific player", () => {
    addPlayer(players, "123", "Alice", 1);

    expect(getPlayer(players, "123")).toEqual({
      name: "Alice",
      match: 1,
      level: 0,
      progress: 0,
      eliminated: false,
    });
  });

  test("Set a player has eliminated", () => {
    addPlayer(players, "123", "Alice", 1);
    setPlayerEliminated(players, "123");

    expect(players["123"].eliminated).toBe(true);
  });

  test("Incr player level", () => {
    addPlayer(players, "123", "Alice", 1);
    incrPlayerLevel(players, "123");

    expect(players["123"].level).toBe(1);
    expect(players["123"].progress).toBe(0);
  });
});
