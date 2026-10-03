const prisma = require('../src/lib/prisma');
const tournamentRepository = require('../src/repositories/tournamentRepository');

describe('Tournament Repository', () => {
	afterAll(async () => {
		await prisma.$disconnect();
	});

	test('can create and find a tournament', async () => {
		const tournament = await tournamentRepository.create({
			name: 'Test Tournament',
			playerCount: 8,
			status: 'DRAFT',
		});

		expect(tournament).toBeDefined();
		expect(tournament.name).toBe('Test Tournament');
		expect(tournament.playerCount).toBe(8);

		const foundTournament = await tournamentRepository.findById(
			tournament.id
		);

		expect(foundTournament).toBeDefined();
		expect(foundTournament.id).toBe(tournament.id);
	});
});