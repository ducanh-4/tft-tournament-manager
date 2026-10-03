const {
	getAllTournaments,
	getTournamentById,
	createTournament,
} = require('../services/tournamentService');

async function getTournaments(req, res) {
	try {
		const tournaments = await getAllTournaments();

		return res.json({
			success: true,
			data: tournaments,
		});
	} catch (error) {
		console.error('Get tournaments error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to get tournaments',
		});
	}
}

async function getTournament(req, res) {
	try {
		const id = Number(req.params.id);

		if (!Number.isInteger(id) || id <= 0) {
			return res.status(400).json({
				success: false,
				message: 'Invalid tournament id',
			});
		}

		const tournament = await getTournamentById(id);

		return res.json({
			success: true,
			data: tournament,
		});
	} catch (error) {
		if (error.message === 'Tournament not found') {
			return res.status(404).json({
				success: false,
				message: error.message,
			});
		}

		console.error('Get tournament error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to get tournament',
		});
	}
}

async function createNewTournament(req, res) {
	try {
		const { name, playerCount } = req.body;

		const tournament = await createTournament({
			name,
			playerCount,
		});

		return res.status(201).json({
			success: true,
			data: tournament,
		});
	} catch (error) {
		if (
			error.message === 'Tournament name is required' ||
			error.message === 'Invalid tournament player count'
		) {
			return res.status(400).json({
				success: false,
				message: error.message,
			});
		}

		console.error('Create tournament error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to create tournament',
		});
	}
}

module.exports = {
	getTournaments,
	getTournament,
	createNewTournament,
};