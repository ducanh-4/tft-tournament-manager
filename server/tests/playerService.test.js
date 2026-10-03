const prisma = require('../src/lib/prisma');
const playerService = require('../src/services/playerService');

describe('Player Service', () => {
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

	test('can create a player', async () => {
		createdPlayer = await playerService.createPlayer({
			displayName: `Service Player ${Date.now()}`,
		});

		expect(createdPlayer).toBeDefined();
		expect(createdPlayer.displayName).toContain('Service Player');
	});

	test('can get all players', async () => {
		const players = await playerService.getAllPlayers();

		expect(Array.isArray(players)).toBe(true);
		expect(players.length).toBeGreaterThan(0);
	});

	test('can get player by id', async () => {
		const player = await playerService.getPlayerById(createdPlayer.id);

		expect(player).toBeDefined();
		expect(player.id).toBe(createdPlayer.id);
		expect(player.displayName).toBe(createdPlayer.displayName);
	});

	test('throws error when player does not exist', async () => {
		await expect(
			playerService.getPlayerById(999999)
		).rejects.toThrow('Player not found');
	});

	test('rejects empty display name', async () => {
		await expect(
			playerService.createPlayer({
				displayName: '',
			})
		).rejects.toThrow('Player display name is required');
	});

	test('rejects whitespace-only display name', async () => {
		await expect(
			playerService.createPlayer({
				displayName: '   ',
			})
		).rejects.toThrow('Player display name is required');
	});

	test('rejects duplicate player name', async () => {
		await expect(
			playerService.createPlayer({
				displayName: createdPlayer.displayName,
			})
		).rejects.toThrow('Player already exists');
	});

	test('trims display name before creating player', async () => {
		const player = await playerService.createPlayer({
			displayName: '  Trimmed Player  ',
		});

		expect(player.displayName).toBe('Trimmed Player');

		await prisma.player.delete({
			where: {
				id: player.id,
			},
		});
	});
});