const { getRankings: fetchRankings } = require('../services/rankingService');

async function getRankings(req, res) {
	const tournamentId = Number(req.query.tournamentId);
	const roundId = Number(req.query.roundId);
	const lobbyId = Number(req.query.lobbyId);

	if (
		![tournamentId, roundId, lobbyId].every(
			(id) => Number.isInteger(id) && id > 0
		)
	) {
		return res.status(400).json({
			success: false,
			message: 'Tournament, round, and lobby ids are required',
		});
	}

	try {
		const rankings = await fetchRankings({
			tournamentId,
			roundId,
			lobbyId,
		});

		return res.json({
			success: true,
			data: rankings,
		});
	} catch (error) {
		if (error.message === 'Lobby not found in selected tournament round') {
			return res.status(404).json({
				success: false,
				message: error.message,
			});
		}

		console.error('Get rankings error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to get rankings',
		});
	}
}

module.exports = {
	getRankings,
};
