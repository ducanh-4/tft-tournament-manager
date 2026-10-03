const {
	getNextPlayerCount,
	isFinalRound,
	isValidPlayerCount,
} = require('../utils/tournamentRules');

const tournamentRepository = require('../repositories/tournamentRepository');

function calculateLobbyCount(playerCount) {
	if (!isValidPlayerCount(playerCount)) {
		throw new Error('Invalid tournament player count');
	}

	return playerCount / 8;
}

function calculateNextRoundPlayerCount(playerCount) {
	return getNextPlayerCount(playerCount);
}

function getRoundInfo(playerCount) {
	return {
		playerCount,
		lobbyCount: calculateLobbyCount(playerCount),
		nextPlayerCount: calculateNextRoundPlayerCount(playerCount),
		isFinal: isFinalRound(playerCount),
	};
}

function shufflePlayers(players) {
	const shuffledPlayers = [...players];

	for (let index = shuffledPlayers.length - 1; index > 0; index--) {
		const swapIndex = Math.floor(Math.random() * (index + 1));

		[shuffledPlayers[index], shuffledPlayers[swapIndex]] = [
			shuffledPlayers[swapIndex],
			shuffledPlayers[index],
		];
	}

	return shuffledPlayers;
}

function createLobbies(players) {
	if (!Array.isArray(players)) {
		throw new Error('Players must be an array');
	}

	if (!isValidPlayerCount(players.length)) {
		throw new Error('Invalid tournament player count');
	}

	const shuffledPlayers = shufflePlayers(players);
	const lobbies = [];

	for (let index = 0; index < shuffledPlayers.length; index += 8) {
		lobbies.push(shuffledPlayers.slice(index, index + 8));
	}

	return lobbies;
}

// ==================== DATABASE OPERATIONS ====================

async function getAllTournaments() {
	return tournamentRepository.findAll();
}

async function getTournamentById(id) {
	const tournament = await tournamentRepository.findById(id);

	if (!tournament) {
		throw new Error('Tournament not found');
	}

	return tournament;
}

async function createTournament({ name, playerCount }) {
	if (typeof name !== 'string' || name.trim() === '') {
		throw new Error('Tournament name is required');
	}

	if (!isValidPlayerCount(playerCount)) {
		throw new Error('Invalid tournament player count');
	}

	return tournamentRepository.create({
		name: name.trim(),
		playerCount,
		status: 'DRAFT',
	});
}

module.exports = {
	calculateLobbyCount,
	calculateNextRoundPlayerCount,
	getRoundInfo,
	shufflePlayers,
	createLobbies,
	getAllTournaments,
	getTournamentById,
	createTournament,
};