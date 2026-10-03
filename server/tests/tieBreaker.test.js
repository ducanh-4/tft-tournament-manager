const {
  comparePlayersByRegionalTieBreakers,
  rankPlayersByRegionalTieBreakers,
} = require('../src/services/tieBreakerService');

describe('Regional Tie Breaker Service', () => {
  describe('comparePlayersByRegionalTieBreakers', () => {
    test('player with more first-place finishes ranks higher', () => {
      const playerA = {
        playerId: 1,
        totalPoints: 20,
        firstPlaceCount: 3,
        top4Count: 4,
        lastPlaceCount: 0,
        latestPlacement: 5,
        secondPlaceCount: 0,
        thirdPlaceCount: 0,
      };

      const playerB = {
        playerId: 2,
        totalPoints: 25,
        firstPlaceCount: 2,
        top4Count: 4,
        lastPlaceCount: 0,
        latestPlacement: 5,
        secondPlaceCount: 0,
        thirdPlaceCount: 0,
      };

      expect(comparePlayersByRegionalTieBreakers(playerA, playerB)).toBeLessThan(0);
    });

    test('higher total points ranks higher when first-place count is equal', () => {
      const playerA = {
        playerId: 1,
        totalPoints: 30,
        firstPlaceCount: 2,
        top4Count: 4,
        lastPlaceCount: 0,
        latestPlacement: 5,
        secondPlaceCount: 0,
        thirdPlaceCount: 0,
      };

      const playerB = {
        playerId: 2,
        totalPoints: 25,
        firstPlaceCount: 2,
        top4Count: 4,
        lastPlaceCount: 0,
        latestPlacement: 5,
        secondPlaceCount: 0,
        thirdPlaceCount: 0,
      };

      expect(comparePlayersByRegionalTieBreakers(playerA, playerB)).toBeLessThan(0);
    });

    test('more top-4 finishes ranks higher', () => {
      const playerA = {
        playerId: 1,
        totalPoints: 20,
        firstPlaceCount: 2,
        top4Count: 5,
        lastPlaceCount: 1,
        latestPlacement: 6,
        secondPlaceCount: 0,
        thirdPlaceCount: 0,
      };

      const playerB = {
        playerId: 2,
        totalPoints: 20,
        firstPlaceCount: 2,
        top4Count: 4,
        lastPlaceCount: 1,
        latestPlacement: 6,
        secondPlaceCount: 0,
        thirdPlaceCount: 0,
      };

      expect(comparePlayersByRegionalTieBreakers(playerA, playerB)).toBeLessThan(0);
    });

    test('fewer eighth-place finishes ranks higher', () => {
      const playerA = {
        playerId: 1,
        totalPoints: 20,
        firstPlaceCount: 2,
        top4Count: 4,
        lastPlaceCount: 0,
        latestPlacement: 6,
        secondPlaceCount: 0,
        thirdPlaceCount: 0,
      };

      const playerB = {
        playerId: 2,
        totalPoints: 20,
        firstPlaceCount: 2,
        top4Count: 4,
        lastPlaceCount: 1,
        latestPlacement: 6,
        secondPlaceCount: 0,
        thirdPlaceCount: 0,
      };

      expect(comparePlayersByRegionalTieBreakers(playerA, playerB)).toBeLessThan(0);
    });

    test('better latest placement ranks higher', () => {
      const playerA = {
        playerId: 1,
        totalPoints: 20,
        firstPlaceCount: 2,
        top4Count: 4,
        lastPlaceCount: 1,
        latestPlacement: 3,
        secondPlaceCount: 0,
        thirdPlaceCount: 0,
      };

      const playerB = {
        playerId: 2,
        totalPoints: 20,
        firstPlaceCount: 2,
        top4Count: 4,
        lastPlaceCount: 1,
        latestPlacement: 5,
        secondPlaceCount: 0,
        thirdPlaceCount: 0,
      };

      expect(comparePlayersByRegionalTieBreakers(playerA, playerB)).toBeLessThan(0);
    });

    test('more second-place finishes ranks higher', () => {
      const playerA = {
        playerId: 1,
        totalPoints: 20,
        firstPlaceCount: 2,
        top4Count: 4,
        lastPlaceCount: 1,
        latestPlacement: 5,
        secondPlaceCount: 2,
        thirdPlaceCount: 0,
      };

      const playerB = {
        playerId: 2,
        totalPoints: 20,
        firstPlaceCount: 2,
        top4Count: 4,
        lastPlaceCount: 1,
        latestPlacement: 5,
        secondPlaceCount: 1,
        thirdPlaceCount: 0,
      };

      expect(comparePlayersByRegionalTieBreakers(playerA, playerB)).toBeLessThan(0);
    });

    test('more third-place finishes ranks higher', () => {
      const playerA = {
        playerId: 1,
        totalPoints: 20,
        firstPlaceCount: 2,
        top4Count: 4,
        lastPlaceCount: 1,
        latestPlacement: 5,
        secondPlaceCount: 1,
        thirdPlaceCount: 2,
      };

      const playerB = {
        playerId: 2,
        totalPoints: 20,
        firstPlaceCount: 2,
        top4Count: 4,
        lastPlaceCount: 1,
        latestPlacement: 5,
        secondPlaceCount: 1,
        thirdPlaceCount: 1,
      };

      expect(comparePlayersByRegionalTieBreakers(playerA, playerB)).toBeLessThan(0);
    });
  });

  describe('rankPlayersByRegionalTieBreakers', () => {
    test('ranks players according to Regional tie-break rules', () => {
      const players = [
        {
          playerId: 1,
          totalPoints: 20,
          firstPlaceCount: 1,
          top4Count: 4,
          lastPlaceCount: 0,
          latestPlacement: 4,
          secondPlaceCount: 2,
          thirdPlaceCount: 1,
        },
        {
          playerId: 2,
          totalPoints: 20,
          firstPlaceCount: 2,
          top4Count: 3,
          lastPlaceCount: 1,
          latestPlacement: 8,
          secondPlaceCount: 0,
          thirdPlaceCount: 0,
        },
        {
          playerId: 3,
          totalPoints: 20,
          firstPlaceCount: 1,
          top4Count: 4,
          lastPlaceCount: 0,
          latestPlacement: 3,
          secondPlaceCount: 2,
          thirdPlaceCount: 1,
        },
      ];

      const rankedPlayers = rankPlayersByRegionalTieBreakers(players);

      expect(rankedPlayers.map((player) => player.playerId)).toEqual([
        2,
        3,
        1,
      ]);
    });

    test('does not mutate the original players array', () => {
      const players = [
        {
          playerId: 1,
          totalPoints: 20,
          firstPlaceCount: 1,
          top4Count: 4,
          lastPlaceCount: 0,
          latestPlacement: 4,
          secondPlaceCount: 2,
          thirdPlaceCount: 1,
        },
        {
          playerId: 2,
          totalPoints: 20,
          firstPlaceCount: 2,
          top4Count: 3,
          lastPlaceCount: 1,
          latestPlacement: 8,
          secondPlaceCount: 0,
          thirdPlaceCount: 0,
        },
      ];

      const originalPlayers = [...players];

      rankPlayersByRegionalTieBreakers(players);

      expect(players).toEqual(originalPlayers);
    });
  });
});