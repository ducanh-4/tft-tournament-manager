const prisma = require('../src/lib/prisma');

describe('Prisma database connection', () => {
	afterAll(async () => {
		await prisma.$disconnect();
	});

	test('can connect to database', async () => {
		await expect(prisma.$queryRaw`SELECT 1`).resolves.toBeDefined();
	});
});