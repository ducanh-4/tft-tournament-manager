const prisma = require('../src/lib/prisma');
const tournamentPlayerRepository = require('../src/repositories/tournamentPlayerRepository');
const roundRepository = require('../src/repositories/roundRepository');
const {
  createRound,
  getTournamentRounds,
  getRoundById,
} = require('../src/services/roundCreationService');

describe('Round Creation Service', () => {
  const tournamentIds = [];
  const playerIds = [];
  const players = [];
  let sixteenPlayerTournament;
  let eightPlayerTournament;
  let mismatchedTournament;
  let roundsQueryTournament;
  let existingRound;
  let roundsQueryRoundOne;
  let roundsQueryRoundTwo;
  let unknownTournamentId;
  let unknownRoundId;

  async function createTournament(name, playerCount) {
    const tournament = await prisma.tournament.create({
      data: {
        name,
        playerCount,
        status: 'DRAFT',
      },
    });
    tournamentIds.push(tournament.id);
    return tournament;
  }

  async function registerPlayers(tournamentId, selectedPlayers) {
    for (const player of selectedPlayers) {
      await tournamentPlayerRepository.create(tournamentId, player.id);
    }
  }

  async function findUnusedId(model) {
    let candidate = 2_000_000_000;

    while (await model.findUnique({ where: { id: candidate } })) {
      candidate -= 1;
    }

    return candidate;
  }

  beforeAll(async () => {
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    for (let index = 1; index <= 16; index++) {
      const player = await prisma.player.create({
        data: {
          displayName: `Round Creation ${uniqueSuffix} Player ${index}`,
        },
      });
      players.push(player);
      playerIds.push(player.id);
    }

    sixteenPlayerTournament = await createTournament(
      `Round Creation ${uniqueSuffix} 16 Players`,
      16,
    );
    await registerPlayers(sixteenPlayerTournament.id, players);
    existingRound = await roundRepository.create({
      tournamentId: sixteenPlayerTournament.id,
      roundNumber: 1,
      type: 'QUALIFIER',
    });

    eightPlayerTournament = await createTournament(
      `Round Creation ${uniqueSuffix} 8 Players`,
      8,
    );
    await registerPlayers(eightPlayerTournament.id, players.slice(0, 8));

    mismatchedTournament = await createTournament(
      `Round Creation ${uniqueSuffix} Mismatched`,
      8,
    );
    await registerPlayers(mismatchedTournament.id, players.slice(0, 7));

    roundsQueryTournament = await createTournament(
      `Round Creation ${uniqueSuffix} Round Query`,
      8,
    );
    roundsQueryRoundOne = await roundRepository.create({
      tournamentId: roundsQueryTournament.id,
      roundNumber: 1,
      type: 'QUALIFIER',
    });
    roundsQueryRoundTwo = await roundRepository.create({
      tournamentId: roundsQueryTournament.id,
      roundNumber: 2,
      type: 'FINAL',
    });

    unknownTournamentId = await findUnusedId(prisma.tournament);
    unknownRoundId = await findUnusedId(prisma.round);
  });

  afterAll(async () => {
    try {
      if (tournamentIds.length > 0) {
        await prisma.tournament.deleteMany({
          where: { id: { in: tournamentIds } },
        });
      }

      if (playerIds.length > 0) {
        await prisma.player.deleteMany({
          where: { id: { in: playerIds } },
        });
      }
    } finally {
      await prisma.$disconnect();
    }
  });

  test('creates the correct qualifier round, lobbies, and lobby-player records', async () => {
    const round = await createRound(sixteenPlayerTournament.id);

    expect(round.type).toBe('QUALIFIER');
    expect(round.roundNumber).toBe(2);
    expect(round.lobbies).toHaveLength(2);
    expect(round.lobbies.every((lobby) => lobby.players.length === 8)).toBe(true);

    const lobbyIds = round.lobbies.map((lobby) => lobby.id);
    const lobbyPlayers = await prisma.lobbyPlayer.findMany({
      where: { lobbyId: { in: lobbyIds } },
      orderBy: { playerId: 'asc' },
    });
    const assignedPlayerIds = lobbyPlayers.map((lobbyPlayer) => lobbyPlayer.playerId);

    expect(lobbyPlayers).toHaveLength(16);
    expect(assignedPlayerIds).toEqual([...playerIds].sort((first, second) => first - second));
    expect(round.lobbies.flatMap((lobby) => lobby.players)).toHaveLength(16);
    expect(round.lobbies.flatMap((lobby) => lobby.players).every((lobbyPlayer) =>
      lobbyPlayer.player && playerIds.includes(lobbyPlayer.playerId),
    )).toBe(true);
  });

  test('creates a final round with one lobby for 8 players', async () => {
    const round = await createRound(eightPlayerTournament.id);

    expect(round.type).toBe('FINAL');
    expect(round.roundNumber).toBe(1);
    expect(round.lobbies).toHaveLength(1);
    expect(round.lobbies[0].players).toHaveLength(8);
  });

  test('throws when the tournament does not exist', async () => {
    await expect(createRound(unknownTournamentId)).rejects.toThrow('Tournament not found');
  });

  test('throws when the registered player count does not match', async () => {
    await expect(createRound(mismatchedTournament.id)).rejects.toThrow(
      'Registered player count does not match tournament player count',
    );
  });

  test('returns only rounds belonging to the requested tournament', async () => {
    const rounds = await getTournamentRounds(roundsQueryTournament.id);

    expect(rounds.map((round) => round.id)).toEqual([
      roundsQueryRoundOne.id,
      roundsQueryRoundTwo.id,
    ]);
    expect(rounds.every((round) => round.tournamentId === roundsQueryTournament.id)).toBe(true);
  });

  test('returns an existing round by id', async () => {
    const round = await getRoundById(existingRound.id);

    expect(round.id).toBe(existingRound.id);
    expect(round.tournamentId).toBe(sixteenPlayerTournament.id);
  });

  test('throws when a round does not exist', async () => {
    await expect(getRoundById(unknownRoundId)).rejects.toThrow('Round not found');
  });
});