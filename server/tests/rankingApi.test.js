const request = require('supertest');
const prisma = require('../src/lib/prisma');
const app = require('../src/app');

describe('Ranking API', () => {
	let tournaments = [];
	let lobbies = [];
	let players = [];
	let primaryScope;
	let incompleteScope;
	let otherTournamentLobbyId;

	async function createMatch(lobby, day, gameNumber, status, placements) {
		const match = await prisma.match.create({
			data: {
				lobbyId: lobby.id,
				dayId: day.id,
				gameNumber,
				status,
				...(status === 'COMPLETED' ? { completedAt: new Date() } : {}),
			},
		});

		if (placements.length > 0) {
			await prisma.matchResult.createMany({
				data: placements.map(({ player, placement }) => ({
					matchId: match.id,
					playerId: player.id,
					placement,
					points: 9 - placement,
				})),
			});
		}

		return match;
	}

	beforeAll(async () => {
		const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
		const playerNames = Array.from(
			{ length: 16 },
			(_, index) => `Player ${index + 1}`
		);

		for (const name of playerNames) {
			players.push(
				await prisma.player.create({
					data: {
						displayName: `Ranking ${suffix} ${name}`,
					},
				})
			);
		}

		const tournament = await prisma.tournament.create({
			data: {
				name: `Ranking API ${suffix}`,
				playerCount: 16,
			},
		});
		tournaments.push(tournament);

		const round = await prisma.round.create({
			data: {
				tournamentId: tournament.id,
				roundNumber: 1,
			},
		});
		const day = await prisma.day.create({
			data: {
				tournamentId: tournament.id,
				dayNumber: 1,
			},
		});
		const completeLobby = await prisma.lobby.create({
			data: {
				roundId: round.id,
				lobbyNumber: 1,
				players: {
					create: players.slice(0, 8).map((player) => ({
						playerId: player.id,
					})),
				},
			},
		});
		const incompleteLobby = await prisma.lobby.create({
			data: {
				roundId: round.id,
				lobbyNumber: 2,
				players: {
					create: players.slice(8, 16).map((player) => ({
						playerId: player.id,
					})),
				},
			},
		});
		lobbies.push(completeLobby, incompleteLobby);
		primaryScope = {
			tournamentId: tournament.id,
			roundId: round.id,
			lobbyId: completeLobby.id,
		};
		incompleteScope = {
			tournamentId: tournament.id,
			roundId: round.id,
			lobbyId: incompleteLobby.id,
		};

		const gameOnePlacements = [1, 2, 3, 4, 5, 6, 7, 8];
		const gameTwoPlacements = [8, 7, 6, 5, 4, 3, 2, 1];

		await createMatch(
			completeLobby,
			day,
			1,
			'COMPLETED',
			players.slice(0, 8).map((player, index) => ({
				player,
				placement: gameOnePlacements[index],
			}))
		);
		await createMatch(
			completeLobby,
			day,
			2,
			'COMPLETED',
			players.slice(0, 8).map((player, index) => ({
				player,
				placement: gameTwoPlacements[index],
			}))
		);

		await createMatch(
			incompleteLobby,
			day,
			1,
			'COMPLETED',
			players.slice(8, 15).map((player, index) => ({
				player,
				placement: index + 1,
			}))
		);
		await createMatch(incompleteLobby, day, 2, 'IN_PROGRESS', [
			{ player: players[8], placement: 1 },
		]);

		const otherTournament = await prisma.tournament.create({
			data: {
				name: `Ranking API Other ${suffix}`,
				playerCount: 8,
			},
		});
		tournaments.push(otherTournament);
		const otherRound = await prisma.round.create({
			data: {
				tournamentId: otherTournament.id,
				roundNumber: 1,
			},
		});
		const otherDay = await prisma.day.create({
			data: {
				tournamentId: otherTournament.id,
				dayNumber: 1,
			},
		});
		const otherLobby = await prisma.lobby.create({
			data: {
				roundId: otherRound.id,
				lobbyNumber: 1,
				players: {
					create: players.slice(0, 8).map((player) => ({
						playerId: player.id,
					})),
				},
			},
		});
		lobbies.push(otherLobby);
		otherTournamentLobbyId = otherLobby.id;

		for (const gameNumber of [1, 2]) {
			await createMatch(
				otherLobby,
				otherDay,
				gameNumber,
				'COMPLETED',
				players.slice(0, 8).map((player, index) => ({
					player,
					placement: gameNumber === 1 ? index + 1 : 8 - index,
				}))
			);
		}
	});

	afterAll(async () => {
		try {
			if (lobbies.length > 0) {
				await prisma.match.deleteMany({
					where: {
						lobbyId: {
							in: lobbies.map((lobby) => lobby.id),
						},
					},
				});
			}

			if (tournaments.length > 0) {
				await prisma.tournament.deleteMany({
					where: {
						id: {
							in: tournaments.map((tournament) => tournament.id),
						},
					},
				});
			}

			if (players.length > 0) {
				await prisma.player.deleteMany({
					where: {
						id: {
							in: players.map((player) => player.id),
						},
					},
				});
			}
		} finally {
			await prisma.$disconnect();
		}
	});

	test('returns separate completed game points and ranks total-point ties with regional rules', async () => {
		const response = await request(app).get(
			`/api/rankings?${new URLSearchParams(primaryScope)}`
		);

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.data).toHaveLength(8);

		const playerRankings = Object.fromEntries(
			response.body.data.map((entry) => [entry.playerId, entry])
		);

		expect(playerRankings[players[0].id]).toMatchObject({
			displayName: players[0].displayName,
			game1Points: 8,
			game2Points: 1,
			totalPoints: 9,
			completedMatches: 2,
			bo2Complete: true,
		});
		expect(playerRankings[players[7].id]).toMatchObject({
			game1Points: 1,
			game2Points: 8,
			totalPoints: 9,
			completedMatches: 2,
			bo2Complete: true,
		});

		expect(
			response.body.data.map((entry) => entry.playerId)
		).toEqual([
			players[7].id,
			players[0].id,
			players[6].id,
			players[5].id,
			players[4].id,
			players[3].id,
			players[2].id,
			players[1].id,
		]);
		expect(response.body.data.map((entry) => entry.rank)).toEqual([
			1, 2, 3, 4, 5, 6, 7, 8,
		]);
	});

	test('does not complete or rank a BO2 when either game has no completed result', async () => {
		const response = await request(app).get(
			`/api/rankings?${new URLSearchParams(incompleteScope)}`
		);

		expect(response.statusCode).toBe(200);
		const playerWithOneCompletedGame = response.body.data.find(
			(entry) => entry.playerId === players[8].id
		);
		const playerWithoutResults = response.body.data.find(
			(entry) => entry.playerId === players[15].id
		);

		expect(playerWithOneCompletedGame).toMatchObject({
			game1Points: 8,
			game2Points: null,
			totalPoints: null,
			completedMatches: 1,
			bo2Complete: false,
			rank: null,
		});
		expect(playerWithoutResults).toMatchObject({
			game1Points: null,
			game2Points: null,
			totalPoints: null,
			completedMatches: 0,
			bo2Complete: false,
			rank: null,
		});
	});

	test('requires a tournament, round, and lobby scope', async () => {
		const response = await request(app).get('/api/rankings');

		expect(response.statusCode).toBe(400);
		expect(response.body.success).toBe(false);
	});

	test('rejects a lobby outside the selected tournament and round', async () => {
		const response = await request(app).get(
			`/api/rankings?${new URLSearchParams({
				...primaryScope,
				lobbyId: otherTournamentLobbyId,
			})}`
		);

		expect(response.statusCode).toBe(404);
		expect(response.body.success).toBe(false);
	});

	test('lists tournament rounds with their lobbies for BO2 selection', async () => {
		const response = await request(app).get(
			`/api/tournaments/${primaryScope.tournamentId}/rounds`
		);

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.data).toHaveLength(1);
		expect(response.body.data[0].lobbies).toHaveLength(2);
	});
});
