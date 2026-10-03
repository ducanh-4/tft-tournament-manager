const {
  calculateLobbyCount,
  calculateNextRoundPlayerCount,
  getRoundInfo,
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
});