const {
	calculateBo2TotalPoints,
	getQualifiedPlayers,
} = require('./matchService');
const {
	createLobbies,
	getRoundInfo,
} = require('./tournamentService');
const { rankPlayersByRegionalTieBreakers } = require('./tieBreakerService');

function processLobbyResults(gameResults) {
	if (!Array.isArray(gameResults)) {
		throw new Error('Game results must be an array');
	}

	const playersWithStats = gameResults.map((player) => {
		if (!Array.isArray(player.games) || player.games.length !== 2) {
			throw new Error('Each player must have results for exactly two games');
		}

		const firstPlacement = player.games[0].placement;
		const latestPlacement = player.games[1].placement;
		const placements = [firstPlacement, latestPlacement];

		return {
			...player,
			totalPoints: calculateBo2TotalPoints(firstPlacement, latestPlacement),
			firstPlaceCount: placements.filter((placement) => placement === 1).length,
			top4Count: placements.filter((placement) => placement <= 4).length,
			lastPlaceCount: placements.filter((placement) => placement === 8).length,
			latestPlacement,
			secondPlaceCount: placements.filter((placement) => placement === 2).length,
			thirdPlaceCount: placements.filter((placement) => placement === 3).length,
		};
	});

	return rankPlayersByRegionalTieBreakers(playersWithStats);
}

function runRound(players, lobbyResults) {
	const lobbies = createLobbies(players);

	if (!Array.isArray(lobbyResults) || lobbyResults.length !== lobbies.length) {
		throw new Error('Lobby results must contain results for every lobby');
	}

	const qualifiedPlayers = lobbyResults.flatMap((gameResults) =>
		getQualifiedPlayers(processLobbyResults(gameResults)),
	);
	const roundInfo = getRoundInfo(players.length);

	return {
		playerCount: players.length,
		lobbyCount: lobbies.length,
		lobbies,
		qualifiedPlayers,
		qualifiedPlayerCount: qualifiedPlayers.length,
		nextPlayerCount: roundInfo.nextPlayerCount,
		isFinal: roundInfo.isFinal,
	};
}

function getRoundSummary(playerCount) {
	return getRoundInfo(playerCount);
}

module.exports = {
	runRound,
	processLobbyResults,
	getRoundSummary,
};
