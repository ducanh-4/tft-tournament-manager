const prisma = require('../src/lib/prisma');
const roundRepository = require('../src/repositories/roundRepository');

describe('Round Repository', () => {
	let tournament;
	let round;
	let lobby;
	let player;

	beforeAll(async () => {
		tournament = await prisma.tournament.create({
			data: {
				name: `Round Repository ${Date.now()}`,
				playerCount: 8,
				status: 'DRAFT',
			},
		});

		round = await roundRepository.create({
			tournamentId: tournament.id,
			roundNumber: 1,
			type: 'QUALIFIER',
			status: 'PENDING',
		});

		lobby = await roundRepository.createLobby(
			round.id,
			1
		);

		player = await prisma.player.create({
			data: {
				displayName: `Round Player ${Date.now()}`,
			},
		});
	});

	afterAll(async () => {
		if (tournament) {
			await prisma.tournament.delete({
				where: {
					id: tournament.id,
				},
			});
		}

		if (player) {
			await prisma.player.delete({
				where: {
					id: player.id,
				},
			});
		}

		await prisma.$disconnect();
	});

	test('can find round by id', async () => {
		const foundRound = await roundRepository.findById(
			round.id
		);

		expect(foundRound).toBeDefined();
		expect(foundRound.id).toBe(round.id);
		expect(foundRound.lobbies.length).toBe(1);
	});

	test('can find rounds by tournament', async () => {
		const rounds =
			await roundRepository.findByTournamentId(
				tournament.id
			);

		expect(Array.isArray(rounds)).toBe(true);
		expect(rounds.length).toBe(1);
		expect(rounds[0].id).toBe(round.id);
	});

	test('can add player to lobby', async () => {
		const lobbyPlayer =
			await roundRepository.addPlayerToLobby(
				lobby.id,
				player.id
			);

		expect(lobbyPlayer).toBeDefined();
		expect(lobbyPlayer.lobbyId).toBe(lobby.id);
		expect(lobbyPlayer.playerId).toBe(player.id);
		expect(lobbyPlayer.player.displayName).toBe(
			player.displayName
		);
	});
});