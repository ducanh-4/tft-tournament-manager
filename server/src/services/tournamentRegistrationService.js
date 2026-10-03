const tournamentRepository = require('../repositories/tournamentRepository');
const playerRepository = require('../repositories/playerRepository');
const tournamentPlayerRepository = require('../repositories/tournamentPlayerRepository');

async function getRegisteredPlayers(tournamentId) {
	const tournament = await tournamentRepository.findById(tournamentId);

	if (!tournament) {
		throw new Error('Tournament not found');
	}

	return tournamentPlayerRepository.findPlayersByTournamentId(
		tournamentId
	);
}

async function registerPlayer(tournamentId, playerId) {
	const tournament = await tournamentRepository.findById(tournamentId);

	if (!tournament) {
		throw new Error('Tournament not found');
	}

	const player = await playerRepository.findById(playerId);

	if (!player) {
		throw new Error('Player not found');
	}

	const existingRegistration =
		await tournamentPlayerRepository.findRegistration(
			tournamentId,
			playerId
		);

	if (existingRegistration) {
		throw new Error('Player already registered');
	}

	const registeredCount =
		await tournamentPlayerRepository.countByTournamentId(
			tournamentId
		);

	if (registeredCount >= tournament.playerCount) {
		throw new Error('Tournament is full');
	}

	return tournamentPlayerRepository.create(
		tournamentId,
		playerId
	);
}

module.exports = {
	getRegisteredPlayers,
	registerPlayer,
};