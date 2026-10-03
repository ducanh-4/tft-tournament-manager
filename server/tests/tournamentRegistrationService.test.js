const prisma = require('../src/lib/prisma');
const tournamentRegistrationService = require('../src/services/tournamentRegistrationService');

describe('Tournament Registration Service', () => {
	let tournament;
	let player;
	let registeredPlayer;

	beforeAll(async () => {
		tournament = await prisma.tournament.create({
			data: {
				name: `Service Registration ${Date.now()}`,
				playerCount: 8,
				status: 'DRAFT',
			},
		});

		player = await prisma.player.create({
			data: {
				displayName: `Service Registration Player ${Date.now()}`,
			},
		});
	});

	afterAll(async () => {
		if (registeredPlayer) {
			await prisma.tournamentPlayer.delete({
				where: {
					id: registeredPlayer.id,
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

		if (tournament) {
			await prisma.tournament.delete({
				where: {
					id: tournament.id,
				},
			});
		}

		await prisma.$disconnect();
	});

	test('can register player to tournament', async () => {
		registeredPlayer =
			await tournamentRegistrationService.registerPlayer(
				tournament.id,
				player.id
			);

		expect(registeredPlayer).toBeDefined();
		expect(registeredPlayer.tournamentId).toBe(tournament.id);
		expect(registeredPlayer.playerId).toBe(player.id);
	});

	test('can get registered players', async () => {
		const registrations =
			await tournamentRegistrationService.getRegisteredPlayers(
				tournament.id
			);

		expect(Array.isArray(registrations)).toBe(true);
		expect(registrations.length).toBe(1);
		expect(registrations[0].playerId).toBe(player.id);
	});

	test('rejects duplicate registration', async () => {
		await expect(
			tournamentRegistrationService.registerPlayer(
				tournament.id,
				player.id
			)
		).rejects.toThrow('Player already registered');
	});

	test('rejects registration for missing tournament', async () => {
		await expect(
			tournamentRegistrationService.registerPlayer(
				999999,
				player.id
			)
		).rejects.toThrow('Tournament not found');
	});

	test('rejects registration for missing player', async () => {
		await expect(
			tournamentRegistrationService.registerPlayer(
				tournament.id,
				999999
			)
		).rejects.toThrow('Player not found');
	});

	test('rejects registration when tournament is full', async () => {
		const fullTournament = await prisma.tournament.create({
			data: {
				name: `Full Tournament ${Date.now()}`,
				playerCount: 8,
				status: 'DRAFT',
			},
		});

		const players = [];

		try {
			for (let index = 0; index < 8; index++) {
				const newPlayer = await prisma.player.create({
					data: {
						displayName: `Full Player ${Date.now()}-${index}`,
					},
				});

				players.push(newPlayer);

				await prisma.tournamentPlayer.create({
					data: {
						tournamentId: fullTournament.id,
						playerId: newPlayer.id,
					},
				});
			}

			const extraPlayer = await prisma.player.create({
				data: {
					displayName: `Extra Player ${Date.now()}`,
				},
			});

			players.push(extraPlayer);

			await expect(
				tournamentRegistrationService.registerPlayer(
					fullTournament.id,
					extraPlayer.id
				)
			).rejects.toThrow('Tournament is full');
		} finally {
			await prisma.tournamentPlayer.deleteMany({
				where: {
					tournamentId: fullTournament.id,
				},
			});

			await prisma.player.deleteMany({
				where: {
					id: {
						in: players.map((item) => item.id),
					},
				},
			});

			await prisma.tournament.delete({
				where: {
					id: fullTournament.id,
				},
			});
		}
	});
});