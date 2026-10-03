const prisma = require('../src/lib/prisma');
const playerRepository = require('../src/repositories/playerRepository');

describe('Player Repository', () => {
	let createdPlayer;

	afterAll(async () => {
		if (createdPlayer) {
			await prisma.player.delete({
				where: {
					id: createdPlayer.id,
				},
			});
		}

		await prisma.$disconnect();
	});

	test('can create and find a player', async () => {
		createdPlayer = await playerRepository.create({
			displayName: `Test Player ${Date.now()}`,
		});

		expect(createdPlayer).toBeDefined();
		expect(createdPlayer.displayName).toContain('Test Player');

		const foundPlayer = await playerRepository.findById(
			createdPlayer.id
		);

		expect(foundPlayer).toBeDefined();
		expect(foundPlayer.id).toBe(createdPlayer.id);
	});

	test('can find player by display name', async () => {
		const foundPlayer = await playerRepository.findByDisplayName(
			createdPlayer.displayName
		);

		expect(foundPlayer).toBeDefined();
		expect(foundPlayer.id).toBe(createdPlayer.id);
	});
});