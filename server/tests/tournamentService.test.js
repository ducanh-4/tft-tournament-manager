const {
  calculateLobbyCount,
  calculateNextRoundPlayerCount,
  getRoundInfo,
  shufflePlayers,
  createLobbies,
} = require('../src/services/tournamentService');

describe('Tournament Service', () => {
  describe('calculateLobbyCount', () => {
    test('calculates lobby count correctly', () => {
      expect(calculateLobbyCount(8)).toBe(1);
      expect(calculateLobbyCount(16)).toBe(2);
      expect(calculateLobbyCount(32)).toBe(4);
      expect(calculateLobbyCount(64)).toBe(8);
      expect(calculateLobbyCount(128)).toBe(16);
    });

    test('rejects invalid player counts', () => {
      expect(() => calculateLobbyCount(12)).toThrow();
      expect(() => calculateLobbyCount(24)).toThrow();
      expect(() => calculateLobbyCount(40)).toThrow();
    });
  });

  describe('calculateNextRoundPlayerCount', () => {
    test('calculates the next round player count', () => {
      expect(calculateNextRoundPlayerCount(64)).toBe(32);
      expect(calculateNextRoundPlayerCount(32)).toBe(16);
      expect(calculateNextRoundPlayerCount(16)).toBe(8);
    });

    test('keeps 8 players for the final round', () => {
      expect(calculateNextRoundPlayerCount(8)).toBe(8);
    });
  });

  describe('getRoundInfo', () => {
    test('returns correct information for a normal round', () => {
      expect(getRoundInfo(64)).toEqual({
        playerCount: 64,
        lobbyCount: 8,
        nextPlayerCount: 32,
        isFinal: false,
      });
    });

    test('returns correct information for the final round', () => {
      expect(getRoundInfo(8)).toEqual({
        playerCount: 8,
        lobbyCount: 1,
        nextPlayerCount: 8,
        isFinal: true,
      });
    });
  });

  describe('shufflePlayers', () => {
    test('does not mutate the original players array', () => {
      const players = Array.from({ length: 16 }, (_, index) => index + 1);
      const originalPlayers = [...players];

      shufflePlayers(players);

      expect(players).toEqual(originalPlayers);
    });

    test('returns the same number of players', () => {
      const players = Array.from({ length: 32 }, (_, index) => index + 1);

      const shuffled = shufflePlayers(players);

      expect(shuffled).toHaveLength(32);
      expect(shuffled).toEqual(expect.arrayContaining(players));
    });
  });

  describe('createLobbies', () => {
    test('creates 1 lobby for 8 players', () => {
      const players = Array.from({ length: 8 }, (_, index) => index + 1);

      const lobbies = createLobbies(players);

      expect(lobbies).toHaveLength(1);
      expect(lobbies[0]).toHaveLength(8);
    });

    test('creates 2 lobbies for 16 players', () => {
      const players = Array.from({ length: 16 }, (_, index) => index + 1);

      const lobbies = createLobbies(players);

      expect(lobbies).toHaveLength(2);
      expect(lobbies[0]).toHaveLength(8);
      expect(lobbies[1]).toHaveLength(8);
    });

    test('creates 8 lobbies for 64 players', () => {
      const players = Array.from({ length: 64 }, (_, index) => index + 1);

      const lobbies = createLobbies(players);

      expect(lobbies).toHaveLength(8);
      expect(lobbies.every((lobby) => lobby.length === 8)).toBe(true);
    });

    test('rejects invalid player counts', () => {
      const players = Array.from({ length: 40 }, (_, index) => index + 1);

      expect(() => createLobbies(players)).toThrow();
    });

    test('does not mutate the original players array', () => {
      const players = Array.from({ length: 16 }, (_, index) => index + 1);
      const originalPlayers = [...players];

      createLobbies(players);

      expect(players).toEqual(originalPlayers);
    });
  });
});