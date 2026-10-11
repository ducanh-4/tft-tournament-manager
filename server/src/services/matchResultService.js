
const prisma = require('../lib/prisma');
const matchResultRepository = require('../repositories/matchResultRepository');

async function submitMatchResults(matchId, results) {
  if (!Number.isInteger(matchId) || matchId <= 0) {
    throw new Error('Invalid match id');
  }

  if (!Array.isArray(results) || results.length !== 8) {
    throw new Error('A match must have exactly 8 results');
  }

  const placements = results.map((result) => result.placement);
  const uniquePlacements = new Set(placements);

  if (
    placements.some(
      (placement) =>
        !Number.isInteger(placement) ||
        placement < 1 ||
        placement > 8
    ) ||
    uniquePlacements.size !== 8
  ) {
    throw new Error('Placements must be unique numbers from 1 to 8');
  }

  const playerIds = results.map((result) => result.playerId);

  if (
    playerIds.some(
      (id) => !Number.isInteger(id) || id <= 0
    ) ||
    new Set(playerIds).size !== 8
  ) {
    throw new Error('Player IDs must be unique positive integers');
  }

  const match = await matchResultRepository.findMatchById(matchId);

  if (!match) {
    throw new Error('Match not found');
  }

  const lobbyPlayerIds = new Set(
    match.lobby.players.map((entry) => entry.playerId)
  );

  if (
    playerIds.some((playerId) => !lobbyPlayerIds.has(playerId)) ||
    playerIds.length !== lobbyPlayerIds.size
  ) {
    throw new Error('Results must include every player in the lobby');
  }

  return matchResultRepository.saveResults(
    matchId,
    results.map(({ playerId, placement }) => ({
      playerId,
      placement,
      points: 9 - placement,
    }))
  );
}

async function getMatchResults(matchId) {
  if (!Number.isInteger(matchId) || matchId <= 0) {
    throw new Error('Invalid match id');
  }

  const match = await matchResultRepository.findMatchById(matchId);

  if (!match) {
    throw new Error('Match not found');
  }

  return match;
}

module.exports = {
  submitMatchResults,
  getMatchResults,
};
