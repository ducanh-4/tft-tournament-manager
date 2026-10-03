const request = require('supertest');
const prisma = require('../src/lib/prisma');
const app = require('../src/app');

describe('Player API', () => {
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

	test('GET /api/players returns player list', async () => {
		const response = await request(app).get('/api/players');

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
		expect(Array.isArray(response.body.data)).toBe(true);
	});

	test('POST /api/players creates a player', async () => {
		const response = await request(app)
			.post('/api/players')
			.send({
				displayName: `API Player ${Date.now()}`,
			});

		expect(response.statusCode).toBe(201);
		expect(response.body.success).toBe(true);
		expect(response.body.data).toBeDefined();
		expect(response.body.data.displayName).toContain('API Player');

		createdPlayer = response.body.data;
	});

	test('GET /api/players/:id returns player', async () => {
		const response = await request(app).get(
			`/api/players/${createdPlayer.id}`
		);

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.data.id).toBe(createdPlayer.id);
	});

	test('GET /api/players/:id returns 404 for missing player', async () => {
		const response = await request(app).get('/api/players/999999');

		expect(response.statusCode).toBe(404);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe('Player not found');
	});

	test('GET /api/players/:id validates player id', async () => {
		const response = await request(app).get('/api/players/abc');

		expect(response.statusCode).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe('Invalid player id');
	});

	test('POST /api/players validates empty display name', async () => {
		const response = await request(app)
			.post('/api/players')
			.send({
				displayName: '',
			});

		expect(response.statusCode).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe(
			'Player display name is required'
		);
	});

	test('POST /api/players rejects duplicate display name', async () => {
		const response = await request(app)
			.post('/api/players')
			.send({
				displayName: createdPlayer.displayName,
			});

		expect(response.statusCode).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe('Player already exists');
	});
});