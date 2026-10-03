const {
	getNextPlayerCount,
	isFinalRound,
	isValidPlayerCount,
} = require('../utils/tournamentRules');

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

module.exports = {
	calculateLobbyCount,
	calculateNextRoundPlayerCount,
	getRoundInfo,
};
