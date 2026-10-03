const {
  calculateMatchPoints,
  calculateBo2TotalPoints,
  rankPlayersByPoints,
  getQualifiedPlayers,
} = require('../src/services/matchService');

describe('Match Service', () => {
  describe('calculateMatchPoints', () => {
    test('calculates points from placement', () => {
      expect(calculateMatchPoints(1)).toBe(8);
      expect(calculateMatchPoints(2)).toBe(7);
      expect(calculateMatchPoints(3)).toBe(6);
      expect(calculateMatchPoints(4)).toBe(5);
      expect(calculateMatchPoints(5)).toBe(4);
      expect(calculateMatchPoints(6)).toBe(3);
      expect(calculateMatchPoints(7)).toBe(2);
      expect(calculateMatchPoints(8)).toBe(1);
    });

    test('rejects invalid placement', () => {
      expect(() => calculateMatchPoints(0)).toThrow();
      expect(() => calculateMatchPoints(9)).toThrow();
      expect(() => calculateMatchPoints(1.5)).toThrow();
    });
  });

  describe('calculateBo2TotalPoints', () => {
    test('calculates total points from two games', () => {
      expect(calculateBo2TotalPoints(1, 2)).toBe(15);
      expect(calculateBo2TotalPoints(3, 4)).toBe(11);
      expect(calculateBo2TotalPoints(7, 8)).toBe(3);
    });
  });

  describe('rankPlayersByPoints', () => {
    test('ranks players by total points from highest to lowest', () => {
      const players = [
        { playerId: 1, totalPoints: 10 },
        { playerId: 2, totalPoints: 15 },
        { playerId: 3, totalPoints: 8 },
        { playerId: 4, totalPoints: 12 },
      ];

      const rankedPlayers = rankPlayersByPoints(players);

      expect(rankedPlayers.map((player) => player.playerId)).toEqual([
        2,
        4,
        1,
        3,
      ]);
    });

    test('does not mutate the original players array', () => {
      const players = [
        { playerId: 1, totalPoints: 10 },
        { playerId: 2, totalPoints: 15 },
        { playerId: 3, totalPoints: 8 },
      ];

      const originalPlayers = [...players];

      rankPlayersByPoints(players);

      expect(players).toEqual(originalPlayers);
    });
  });

  describe('getQualifiedPlayers', () => {
    test('returns top 4 players', () => {
      const rankedPlayers = [
        { playerId: 2, totalPoints: 15 },
        { playerId: 4, totalPoints: 12 },
        { playerId: 1, totalPoints: 10 },
        { playerId: 3, totalPoints: 8 },
        { playerId: 5, totalPoints: 7 },
        { playerId: 6, totalPoints: 5 },
        { playerId: 7, totalPoints: 4 },
        { playerId: 8, totalPoints: 2 },
      ];

      const qualifiedPlayers = getQualifiedPlayers(rankedPlayers);

      expect(qualifiedPlayers.map((player) => player.playerId)).toEqual([
        2,
        4,
        1,
        3,
      ]);
    });

    test('returns all players when there are fewer than 4 players', () => {
      const rankedPlayers = [
        { playerId: 1, totalPoints: 10 },
        { playerId: 2, totalPoints: 8 },
      ];

      expect(getQualifiedPlayers(rankedPlayers)).toEqual(rankedPlayers);
    });
  });
});