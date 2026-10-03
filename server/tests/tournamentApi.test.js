const request = require('supertest');
const app = require('../src/app');

describe('Tournament API', () => {
	test('GET /api/health returns API status', async () => {
		const response = await request(app).get('/api/health');

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toBe(
			'TFT Tournament Manager API is running'
		);
	});

	test('GET /api/tournaments returns tournament list', async () => {
		const response = await request(app).get('/api/tournaments');

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
		expect(Array.isArray(response.body.data)).toBe(true);
	});

	test('POST /api/tournaments validates tournament data', async () => {
		const response = await request(app)
			.post('/api/tournaments')
			.send({
				name: 'Invalid Tournament',
				playerCount: 40,
			});

		expect(response.statusCode).toBe(400);
		expect(response.body.success).toBe(false);
	});

	test('POST /api/tournaments validates required name', async () => {
		const response = await request(app)
			.post('/api/tournaments')
			.send({
				playerCount: 64,
			});

		expect(response.statusCode).toBe(400);
		expect(response.body.success).toBe(false);
	});
});