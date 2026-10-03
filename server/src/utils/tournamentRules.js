function isValidPlayerCount(playerCount) {
	if (!Number.isInteger(playerCount) || playerCount < 8) {
		return false;
	}

	while (playerCount > 8 && playerCount % 2 === 0) {
		playerCount /= 2;
	}

	return playerCount === 8;
}

function getNextPlayerCount(playerCount) {
	if (!isValidPlayerCount(playerCount)) {
		throw new Error('Invalid tournament player count');
	}

	return playerCount === 8 ? 8 : playerCount / 2;
}

function isFinalRound(playerCount) {
	return playerCount === 8;
}

function getPointsByPlacement(placement) {
	if (!Number.isInteger(placement) || placement < 1 || placement > 8) {
		throw new Error('Placement must be an integer from 1 to 8');
	}

	return 9 - placement;
}

module.exports = {
	isValidPlayerCount,
	getNextPlayerCount,
	isFinalRound,
	getPointsByPlacement,
};
