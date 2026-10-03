const {
  isValidPlayerCount,
  getNextPlayerCount,
  isFinalRound,
  getPointsByPlacement,
} = require('../src/utils/tournamentRules');

describe('Tournament Rules', () => {
  describe('isValidPlayerCount', () => {
    test('accepts valid player counts', () => {
      expect(isValidPlayerCount(8)).toBe(true);
      expect(isValidPlayerCount(16)).toBe(true);
      expect(isValidPlayerCount(32)).toBe(true);
      expect(isValidPlayerCount(64)).toBe(true);
      expect(isValidPlayerCount(128)).toBe(true);
    });

    test('rejects invalid player counts', () => {
      expect(isValidPlayerCount(0)).toBe(false);
      expect(isValidPlayerCount(-8)).toBe(false);
      expect(isValidPlayerCount(12)).toBe(false);
      expect(isValidPlayerCount(24)).toBe(false);
      expect(isValidPlayerCount(40)).toBe(false);
      expect(isValidPlayerCount(100)).toBe(false);
    });

    test('rejects non-number values', () => {
      expect(isValidPlayerCount('64')).toBe(false);
      expect(isValidPlayerCount(null)).toBe(false);
      expect(isValidPlayerCount(undefined)).toBe(false);
      expect(isValidPlayerCount(16.5)).toBe(false);
    });
  });

  describe('getNextPlayerCount', () => {
    test('halves the player count for the next round', () => {
      expect(getNextPlayerCount(64)).toBe(32);
      expect(getNextPlayerCount(32)).toBe(16);
      expect(getNextPlayerCount(16)).toBe(8);
    });

    test('keeps 8 players for the final round', () => {
      expect(getNextPlayerCount(8)).toBe(8);
    });

    test('throws error for invalid player count', () => {
      expect(() => getNextPlayerCount(40)).toThrow();
    });
  });

  describe('isFinalRound', () => {
    test('returns true for 8 players', () => {
      expect(isFinalRound(8)).toBe(true);
    });

    test('returns false for more than 8 players', () => {
      expect(isFinalRound(16)).toBe(false);
      expect(isFinalRound(32)).toBe(false);
      expect(isFinalRound(64)).toBe(false);
    });
  });

  describe('getPointsByPlacement', () => {
    test('returns correct points for each placement', () => {
      expect(getPointsByPlacement(1)).toBe(8);
      expect(getPointsByPlacement(2)).toBe(7);
      expect(getPointsByPlacement(3)).toBe(6);
      expect(getPointsByPlacement(4)).toBe(5);
      expect(getPointsByPlacement(5)).toBe(4);
      expect(getPointsByPlacement(6)).toBe(3);
      expect(getPointsByPlacement(7)).toBe(2);
      expect(getPointsByPlacement(8)).toBe(1);
    });

    test('throws error for invalid placement', () => {
      expect(() => getPointsByPlacement(0)).toThrow();
      expect(() => getPointsByPlacement(9)).toThrow();
      expect(() => getPointsByPlacement(1.5)).toThrow();
    });
  });
});