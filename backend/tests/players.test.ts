import Players from "../src/gamelogic/players";

describe("Players module", () => {
  let players: Players;

  beforeEach(() => {
    players = new Players();
  });

  test("Add a player", () => {
    players.add("123", "Alice", 1);

    expect(players).toHaveProperty("123");
    expect(players.get("123")).toEqual({
      name: "Alice",
      match: 1,
      level: 0,
      progress: 0,
      eliminated: false,
    });
  });

  test("Remove a player", () => {
    players.add("123", "Alice", 1);
    players.remove("123");
    expect(players).not.toHaveProperty("123");

    players.remove("123");
  });

  test("Get all players", () => {
    expect(players.getAll()).toEqual({});

    players.add("123", "Alice", 1);
    players.add("456", "Bob", 2);
    expect(players.getAll()).toEqual({
      '123': {
        name: "Alice",
        match: 1,
        level: 0,
        progress: 0,
        eliminated: false,
      },
      '456': {
        name: "Bob",
        match: 2,
        level: 0,
        progress: 0,
        eliminated: false,
      },
    });
  });

  test("Get specific player", () => {
    players.add("123", "Alice", 1);
    expect(players.get("123")).toEqual({
      name: "Alice",
      match: 1,
      level: 0,
      progress: 0,
      eliminated: false,
    });
    expect(players.get("456")).toEqual(undefined);
  });

  test("Set a player has eliminated", () => {
    players.add("123", "Alice", 1);
    players.setEliminated("123");
    expect(players.get("123").eliminated).toBe(true);

    players.setEliminated("456");
  });

  test("Incr player level", () => {
    players.add("123", "Alice", 1);
    players.incrLevel("123");
    expect(players.get("123").level).toBe(1);
    expect(players.get("123").progress).toBe(0);

    players.incrLevel("456");
  });
});
