const request = require('supertest');
const prisma = require('../src/lib/prisma');
const app = require('../src/app');

describe('Tournament Registration API', () => {
	let tournament;
	let player;
	let registration;

	beforeAll(async () => {
		tournament = await prisma.tournament.create({
			data: {
				name: `Registration API ${Date.now()}`,
				playerCount: 8,
				status: 'DRAFT',
			},
		});

		player = await prisma.player.create({
			data: {
				displayName: `Registration API Player ${Date.now()}`,
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

	test('POST /api/tournaments/:id/players registers player', async () => {
		const response = await request(app)
			.post(`/api/tournaments/${tournament.id}/players`)
			.send({
				playerId: player.id,
			});

		expect(response.statusCode).toBe(201);
		expect(response.body.success).toBe(true);
		expect(response.body.data.tournamentId).toBe(tournament.id);
		expect(response.body.data.playerId).toBe(player.id);

		registration = response.body.data;
	});

	test('GET /api/tournaments/:id/players returns registered players', async () => {
		const response = await request(app).get(
			`/api/tournaments/${tournament.id}/players`
		);

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
		expect(Array.isArray(response.body.data)).toBe(true);
		expect(response.body.data.length).toBe(1);
		expect(response.body.data[0].playerId).toBe(player.id);
	});

	test('POST rejects duplicate registration', async () => {
		const response = await request(app)
			.post(`/api/tournaments/${tournament.id}/players`)
			.send({
				playerId: player.id,
			});

		expect(response.statusCode).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe(
			'Player already registered'
		);
	});

	test('POST validates tournament id', async () => {
		const response = await request(app)
			.post('/api/tournaments/abc/players')
			.send({
				playerId: player.id,
			});

		expect(response.statusCode).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe('Invalid tournament id');
	});

	test('POST validates player id', async () => {
		const response = await request(app)
			.post(`/api/tournaments/${tournament.id}/players`)
			.send({
				playerId: 0,
			});

		expect(response.statusCode).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe('Invalid player id');
	});

	test('GET returns 404 for missing tournament', async () => {
		const response = await request(app).get(
			'/api/tournaments/999999/players'
		);

		expect(response.statusCode).toBe(404);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe('Tournament not found');
	});
});