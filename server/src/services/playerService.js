const playerRepository = require('../repositories/playerRepository');

async function getAllPlayers() {
	return playerRepository.findAll();
}

async function getPlayerById(id) {
	const player = await playerRepository.findById(id);

	if (!player) {
		throw new Error('Player not found');
	}

	return player;
}

async function createPlayer({ displayName }) {
	if (typeof displayName !== 'string' || displayName.trim() === '') {
		throw new Error('Player display name is required');
	}

	const existingPlayer = await playerRepository.findByDisplayName(
		displayName.trim()
	);

	if (existingPlayer) {
		throw new Error('Player already exists');
	}

	return playerRepository.create({
		displayName: displayName.trim(),
	});
}

module.exports = {
	getAllPlayers,
	getPlayerById,
	createPlayer,
};