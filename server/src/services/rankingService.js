const rankingRepository = require('../repositories/rankingRepository');
const {
	comparePlayersByRegionalTieBreakers,
} = require('./tieBreakerService');

async function getRankings(scope) {
	const lobby = await rankingRepository.findLobbyBo2(scope);

	if (!lobby) {
		throw new Error('Lobby not found in selected tournament round');
	}

	const matchesByGame = new Map(
		lobby.matches.map((match) => [match.gameNumber, match])
	);
	const rankings = lobby.players.map((entry) => {
		const resultsByGame = [1, 2].map((gameNumber) => {
			const match = matchesByGame.get(gameNumber);

			if (!match || match.status !== 'COMPLETED') {
				return null;
			}

			return (
				match.results.find((result) => result.playerId === entry.playerId) ??
				null
			);
		});
		const [game1Result, game2Result] = resultsByGame;
		const bo2Complete = Boolean(game1Result && game2Result);
		const placements = resultsByGame
			.filter(Boolean)
			.map((result) => result.placement);

		return {
			playerId: entry.playerId,
			displayName: entry.player.displayName,
			game1Points: game1Result?.points ?? null,
			game2Points: game2Result?.points ?? null,
			totalPoints:
				bo2Complete
					? game1Result.points + game2Result.points
					: null,
			completedMatches: resultsByGame.filter(Boolean).length,
			bo2Complete,
			firstPlaceCount: placements.filter((placement) => placement === 1).length,
			top4Count: placements.filter((placement) => placement <= 4).length,
			lastPlaceCount: placements.filter((placement) => placement === 8).length,
			latestPlacement: game2Result?.placement ?? 0,
			secondPlaceCount: placements.filter((placement) => placement === 2).length,
			thirdPlaceCount: placements.filter((placement) => placement === 3).length,
		};
	});

	const completedPlayers = rankings
		.filter((player) => player.bo2Complete)
		.sort((first, second) => {
			if (first.totalPoints !== second.totalPoints) {
				return second.totalPoints - first.totalPoints;
			}

			return comparePlayersByRegionalTieBreakers(first, second);
		});
	const rankByPlayerId = new Map(
		completedPlayers.map((player, index) => [player.playerId, index + 1])
	);

	return rankings
		.sort((first, second) => {
			if (first.bo2Complete !== second.bo2Complete) {
				return first.bo2Complete ? -1 : 1;
			}

			if (first.bo2Complete) {
				return (
					rankByPlayerId.get(first.playerId) -
					rankByPlayerId.get(second.playerId)
				);
			}

			return first.playerId - second.playerId;
		})
		.map((player) => ({
			playerId: player.playerId,
			displayName: player.displayName,
			game1Points: player.game1Points,
			game2Points: player.game2Points,
			totalPoints: player.totalPoints,
			completedMatches: player.completedMatches,
			bo2Complete: player.bo2Complete,
			rank: rankByPlayerId.get(player.playerId) ?? null,
		}));
}

module.exports = {
	getRankings,
};
