const {
	runRound,
	processLobbyResults,
	getRoundSummary,
} = require('../src/services/roundService');

describe('roundService', () => {
	describe('getRoundSummary', () => {
		test('returns correct summary for 64 players', () => {
			const summary = getRoundSummary(64);

			expect(summary.playerCount).toBe(64);
			expect(summary.lobbyCount).toBe(8);
			expect(summary.nextPlayerCount).toBe(32);
			expect(summary.isFinal).toBe(false);
		});

		test('returns final round summary for 8 players', () => {
			const summary = getRoundSummary(8);

			expect(summary.playerCount).toBe(8);
			expect(summary.lobbyCount).toBe(1);
			expect(summary.nextPlayerCount).toBe(8);
			expect(summary.isFinal).toBe(true);
		});

		test('rejects invalid player count', () => {
			expect(() => getRoundSummary(40)).toThrow(
				'Invalid tournament player count'
			);
		});
	});

	describe('processLobbyResults', () => {
		test('calculates BO2 total points correctly', () => {
			const gameResults = [
				{
					playerId: 1,
					displayName: 'P1',
					games: [
						{ placement: 1 },
						{ placement: 1 },
					],
				},
				{
					playerId: 2,
					displayName: 'P2',
					games: [
						{ placement: 2 },
						{ placement: 2 },
					],
				},
				{
					playerId: 3,
					displayName: 'P3',
					games: [
						{ placement: 3 },
						{ placement: 3 },
					],
				},
				{
					playerId: 4,
					displayName: 'P4',
					games: [
						{ placement: 4 },
						{ placement: 4 },
					],
				},
				{
					playerId: 5,
					displayName: 'P5',
					games: [
						{ placement: 5 },
						{ placement: 5 },
					],
				},
				{
					playerId: 6,
					displayName: 'P6',
					games: [
						{ placement: 6 },
						{ placement: 6 },
					],
				},
				{
					playerId: 7,
					displayName: 'P7',
					games: [
						{ placement: 7 },
						{ placement: 7 },
					],
				},
				{
					playerId: 8,
					displayName: 'P8',
					games: [
						{ placement: 8 },
						{ placement: 8 },
					],
				},
			];

			const ranked = processLobbyResults(gameResults);

			expect(ranked[0].playerId).toBe(1);
			expect(ranked[0].totalPoints).toBe(16);

			expect(ranked[3].playerId).toBe(4);
			expect(ranked[3].totalPoints).toBe(10);

			expect(ranked[7].playerId).toBe(8);
			expect(ranked[7].totalPoints).toBe(2);
		});

		test('creates Regional tie-break statistics', () => {
			const gameResults = [
				{
					playerId: 1,
					displayName: 'P1',
					games: [
						{ placement: 1 },
						{ placement: 5 },
					],
				},
				{
					playerId: 2,
					displayName: 'P2',
					games: [
						{ placement: 2 },
						{ placement: 2 },
					],
				},
				{
					playerId: 3,
					displayName: 'P3',
					games: [
						{ placement: 3 },
						{ placement: 3 },
					],
				},
				{
					playerId: 4,
					displayName: 'P4',
					games: [
						{ placement: 4 },
						{ placement: 4 },
					],
				},
				{
					playerId: 5,
					displayName: 'P5',
					games: [
						{ placement: 5 },
						{ placement: 1 },
					],
				},
				{
					playerId: 6,
					displayName: 'P6',
					games: [
						{ placement: 6 },
						{ placement: 6 },
					],
				},
				{
					playerId: 7,
					displayName: 'P7',
					games: [
						{ placement: 7 },
						{ placement: 7 },
					],
				},
				{
					playerId: 8,
					displayName: 'P8',
					games: [
						{ placement: 8 },
						{ placement: 8 },
					],
				},
			];

			const ranked = processLobbyResults(gameResults);

			const player1 = ranked.find(
				(player) => player.playerId === 1
			);

			const player5 = ranked.find(
				(player) => player.playerId === 5
			);

			expect(player1.firstPlaceCount).toBe(1);
			expect(player1.top4Count).toBe(1);
			expect(player1.lastPlaceCount).toBe(0);
			expect(player1.latestPlacement).toBe(5);

			expect(player5.firstPlaceCount).toBe(1);
			expect(player5.top4Count).toBe(1);
			expect(player5.latestPlacement).toBe(1);
		});

		test('does not mutate input results', () => {
			const gameResults = [
				{
					playerId: 1,
					displayName: 'P1',
					games: [
						{ placement: 1 },
						{ placement: 1 },
					],
				},
				{
					playerId: 2,
					displayName: 'P2',
					games: [
						{ placement: 2 },
						{ placement: 2 },
					],
				},
				{
					playerId: 3,
					displayName: 'P3',
					games: [
						{ placement: 3 },
						{ placement: 3 },
					],
				},
				{
					playerId: 4,
					displayName: 'P4',
					games: [
						{ placement: 4 },
						{ placement: 4 },
					],
				},
				{
					playerId: 5,
					displayName: 'P5',
					games: [
						{ placement: 5 },
						{ placement: 5 },
					],
				},
				{
					playerId: 6,
					displayName: 'P6',
					games: [
						{ placement: 6 },
						{ placement: 6 },
					],
				},
				{
					playerId: 7,
					displayName: 'P7',
					games: [
						{ placement: 7 },
						{ placement: 7 },
					],
				},
				{
					playerId: 8,
					displayName: 'P8',
					games: [
						{ placement: 8 },
						{ placement: 8 },
					],
				},
			];

			const original = JSON.stringify(gameResults);

			processLobbyResults(gameResults);

			expect(JSON.stringify(gameResults)).toBe(original);
		});
	});

	describe('runRound', () => {
		test('processes 8 players into 1 lobby and qualifies 4 players', () => {
			const players = Array.from(
				{ length: 8 },
				(_, index) => ({
					playerId: index + 1,
					displayName: `P${index + 1}`,
				})
			);

			const lobbyResults = [
				[
					{
						playerId: 1,
						displayName: 'P1',
						games: [
							{ placement: 1 },
							{ placement: 1 },
						],
					},
					{
						playerId: 2,
						displayName: 'P2',
						games: [
							{ placement: 2 },
							{ placement: 2 },
						],
					},
					{
						playerId: 3,
						displayName: 'P3',
						games: [
							{ placement: 3 },
							{ placement: 3 },
						],
					},
					{
						playerId: 4,
						displayName: 'P4',
						games: [
							{ placement: 4 },
							{ placement: 4 },
						],
					},
					{
						playerId: 5,
						displayName: 'P5',
						games: [
							{ placement: 5 },
							{ placement: 5 },
						],
					},
					{
						playerId: 6,
						displayName: 'P6',
						games: [
							{ placement: 6 },
							{ placement: 6 },
						],
					},
					{
						playerId: 7,
						displayName: 'P7',
						games: [
							{ placement: 7 },
							{ placement: 7 },
						],
					},
					{
						playerId: 8,
						displayName: 'P8',
						games: [
							{ placement: 8 },
							{ placement: 8 },
						],
					},
				],
			];

			const result = runRound(players, lobbyResults);

			expect(result.playerCount).toBe(8);
			expect(result.lobbyCount).toBe(1);
			expect(result.qualifiedPlayerCount).toBe(4);
			expect(result.qualifiedPlayers).toHaveLength(4);
			expect(result.nextPlayerCount).toBe(8);
			expect(result.isFinal).toBe(true);
		});

		test('processes 16 players into 2 lobbies and qualifies 8 players', () => {
			const players = Array.from(
				{ length: 16 },
				(_, index) => ({
					playerId: index + 1,
					displayName: `P${index + 1}`,
				})
			);

			const createLobbyResults = (startId) =>
				Array.from(
					{ length: 8 },
					(_, index) => ({
						playerId: startId + index,
						displayName: `P${startId + index}`,
						games: [
							{ placement: index + 1 },
							{ placement: index + 1 },
						],
					})
				);

			const lobbyResults = [
				createLobbyResults(1),
				createLobbyResults(9),
			];

			const result = runRound(players, lobbyResults);

			expect(result.playerCount).toBe(16);
			expect(result.lobbyCount).toBe(2);
			expect(result.qualifiedPlayerCount).toBe(8);
			expect(result.qualifiedPlayers).toHaveLength(8);
			expect(result.nextPlayerCount).toBe(8);
			expect(result.isFinal).toBe(false);
		});

		test('rejects invalid player count', () => {
			const players = Array.from(
				{ length: 40 },
				(_, index) => ({
					playerId: index + 1,
					displayName: `P${index + 1}`,
				})
			);

			expect(() => runRound(players, [])).toThrow(
				'Invalid tournament player count'
			);
		});
	});
});