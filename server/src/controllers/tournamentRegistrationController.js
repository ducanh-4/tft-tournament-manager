const {
	getRegisteredPlayers,
	registerPlayer,
} = require('../services/tournamentRegistrationService');

async function getTournamentPlayers(req, res) {
	try {
		const tournamentId = Number(req.params.id);

		if (!Number.isInteger(tournamentId) || tournamentId <= 0) {
			return res.status(400).json({
				success: false,
				message: 'Invalid tournament id',
			});
		}

		const registrations = await getRegisteredPlayers(tournamentId);

		return res.json({
			success: true,
			data: registrations,
		});
	} catch (error) {
		if (error.message === 'Tournament not found') {
			return res.status(404).json({
				success: false,
				message: error.message,
			});
		}

		console.error('Get tournament players error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to get tournament players',
		});
	}
}

async function registerTournamentPlayer(req, res) {
	try {
		const tournamentId = Number(req.params.id);
		const { playerId } = req.body;

		if (!Number.isInteger(tournamentId) || tournamentId <= 0) {
			return res.status(400).json({
				success: false,
				message: 'Invalid tournament id',
			});
		}

		if (!Number.isInteger(playerId) || playerId <= 0) {
			return res.status(400).json({
				success: false,
				message: 'Invalid player id',
			});
		}

		const registration = await registerPlayer(
			tournamentId,
			playerId
		);

		return res.status(201).json({
			success: true,
			data: registration,
		});
	} catch (error) {
		if (
			error.message === 'Tournament not found' ||
			error.message === 'Player not found'
		) {
			return res.status(404).json({
				success: false,
				message: error.message,
			});
		}

		if (
			error.message === 'Player already registered' ||
			error.message === 'Tournament is full'
		) {
			return res.status(400).json({
				success: false,
				message: error.message,
			});
		}

		console.error('Register tournament player error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to register player',
		});
	}
}

module.exports = {
	getTournamentPlayers,
	registerTournamentPlayer,
};