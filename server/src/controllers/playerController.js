const {
	getAllPlayers,
	getPlayerById,
	createPlayer,
} = require('../services/playerService');

async function getPlayers(req, res) {
	try {
		const players = await getAllPlayers();

		return res.json({
			success: true,
			data: players,
		});
	} catch (error) {
		console.error('Get players error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to get players',
		});
	}
}

async function getPlayer(req, res) {
	try {
		const id = Number(req.params.id);

		if (!Number.isInteger(id) || id <= 0) {
			return res.status(400).json({
				success: false,
				message: 'Invalid player id',
			});
		}

		const player = await getPlayerById(id);

		return res.json({
			success: true,
			data: player,
		});
	} catch (error) {
		if (error.message === 'Player not found') {
			return res.status(404).json({
				success: false,
				message: error.message,
			});
		}

		console.error('Get player error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to get player',
		});
	}
}

async function createNewPlayer(req, res) {
	try {
		const { displayName } = req.body;

		const player = await createPlayer({
			displayName,
		});

		return res.status(201).json({
			success: true,
			data: player,
		});
	} catch (error) {
		if (
			error.message === 'Player display name is required' ||
			error.message === 'Player already exists'
		) {
			return res.status(400).json({
				success: false,
				message: error.message,
			});
		}

		console.error('Create player error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to create player',
		});
	}
}

module.exports = {
	getPlayers,
	getPlayer,
	createNewPlayer,
};