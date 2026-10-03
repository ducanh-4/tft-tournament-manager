const prisma = require('../src/lib/prisma');
const tournamentPlayerRepository = require('../src/repositories/tournamentPlayerRepository');

describe('Tournament Player Repository', () => {
	let tournament;
	let player;
	let registration;

	beforeAll(async () => {
		tournament = await prisma.tournament.create({
			data: {
				name: `Registration Test ${Date.now()}`,
				playerCount: 8,
				status: 'DRAFT',
			},
		});

		player = await prisma.player.create({
			data: {
				displayName: `Registration Player ${Date.now()}`,
			},
		});
	});

	afterAll(async () => {
		if (registration) {
			await prisma.tournamentPlayer.delete({
				where: {
					id: registration.id,
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

	test('can create tournament registration', async () => {
		registration = await tournamentPlayerRepository.create(
			tournament.id,
			player.id
		);

		expect(registration).toBeDefined();
		expect(registration.tournamentId).toBe(tournament.id);
		expect(registration.playerId).toBe(player.id);
		expect(registration.player.displayName).toBe(
			player.displayName
		);
	});

	test('can find registration', async () => {
		const found =
			await tournamentPlayerRepository.findRegistration(
				tournament.id,
				player.id
			);

		expect(found).toBeDefined();
		expect(found.id).toBe(registration.id);
	});

	test('can count registered players', async () => {
		const count =
			await tournamentPlayerRepository.countByTournamentId(
				tournament.id
			);

		expect(count).toBe(1);
	});

	test('can get players registered in tournament', async () => {
		const registrations =
			await tournamentPlayerRepository.findPlayersByTournamentId(
				tournament.id
			);

		expect(Array.isArray(registrations)).toBe(true);
		expect(registrations.length).toBe(1);
		expect(registrations[0].player.id).toBe(player.id);
	});
});