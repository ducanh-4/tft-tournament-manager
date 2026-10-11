
const prisma = require('../lib/prisma');

async function findByLobbyId(lobbyId) {
  return prisma.match.findMany({
    where: {
      lobbyId,
    },
    include: {
      results: {
        include: {
          player: true,
        },
        orderBy: {
          placement: 'asc',
        },
      },
    },
    orderBy: {
      gameNumber: 'asc',
    },
  });
}

async function findMatchById(matchId, client = prisma) {
  return client.match.findUnique({
    where: {
      id: matchId,
    },
    include: {
      lobby: {
        include: {
          players: {
            include: {
              player: true,
            },
          },
          round: true,
        },
      },
      results: true,
    },
  });
}

async function createMatch(data, client = prisma) {
  return client.match.create({
    data,
  });
}

async function saveResults(matchId, results, client = prisma) {
  return client.$transaction(async (tx) => {
    await tx.matchResult.deleteMany({
      where: { matchId },
    });

    await tx.matchResult.createMany({
      data: results.map((result) => ({
        matchId,
        playerId: result.playerId,
        placement: result.placement,
        points: 9 - result.placement,
      })),
    });

    await tx.match.update({
      where: { id: matchId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    return tx.matchResult.findMany({
      where: { matchId },
      include: { player: true },
      orderBy: { placement: 'asc' },
    });
  });
}

module.exports = {
  findByLobbyId,
  findMatchById,
  createMatch,
  saveResults,
};
