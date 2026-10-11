
const request = require('supertest');
const prisma = require('../src/lib/prisma');
const tournamentPlayerRepository = require('../src/repositories/tournamentPlayerRepository');
const app = require('../src/app');

describe('Round API', () => {
        let tournament;
        let players = [];

        beforeAll(async () => {
                const suffix = Date.now();

                tournament = await prisma.tournament.create({
                        data: {
                                name: `Round API ${suffix}`,
                                playerCount: 8,
                                status: 'DRAFT',
                        },
                });

                for (let index = 1; index <= 8; index++) {
                        const player = await prisma.player.create({
                                data: {
                                        displayName: `Round API Player ${suffix} ${index}`,
                                },
                        });

                        players.push(player);
                }
        });

        afterAll(async () => {
                try {
                        if (tournament) {
                                await prisma.match.deleteMany({
                                        where: {
                                                day: {
                                                        tournamentId: tournament.id,
                                                },
                                        },
                                });

                                await prisma.tournament.deleteMany({
                                        where: { id: tournament.id },
                                });
                        }

                        if (players.length > 0) {
                                await prisma.player.deleteMany({
                                        where: {
                                                id: { in: players.map((player) => player.id) },
                                        },
                                });
                        }
                } finally {
                        await prisma.$disconnect();
                }
        });

        test('POST rejects invalid tournament id', async () => {
                const response = await request(app).post(
                        '/api/tournaments/abc/rounds'
                );

                expect(response.statusCode).toBe(400);
                expect(response.body.message).toBe('Invalid tournament id');
        });

        test('POST returns 404 for missing tournament', async () => {
                const response = await request(app).post(
                        '/api/tournaments/999999999/rounds'
                );

                expect(response.statusCode).toBe(404);
                expect(response.body.message).toBe('Tournament not found');
        });

        test('POST rejects tournament without enough registered players', async () => {
                const response = await request(app).post(
                        `/api/tournaments/${tournament.id}/rounds`
                );

                expect(response.statusCode).toBe(400);
                expect(response.body.message).toBe(
                        'Registered player count does not match tournament player count'
                );
        });

        test('POST creates a final round when all 8 players are registered', async () => {
                for (const player of players) {
                        await tournamentPlayerRepository.create(
                                tournament.id,
                                player.id
                        );
                }

                const response = await request(app).post(
                        `/api/tournaments/${tournament.id}/rounds`
                );

                expect(response.statusCode).toBe(201);
                expect(response.body.success).toBe(true);
                expect(response.body.data.type).toBe('FINAL');
                expect(response.body.data.lobbies).toHaveLength(1);
                expect(response.body.data.lobbies[0].players).toHaveLength(8);
        });
});
