const { getPointsByPlacement } = require('../utils/tournamentRules');

function calculateMatchPoints(placement) {
	return getPointsByPlacement(placement);
}

function calculateBo2TotalPoints(firstPlacement, secondPlacement) {
	return calculateMatchPoints(firstPlacement) + calculateMatchPoints(secondPlacement);
}

function rankPlayersByPoints(players) {
	return [...players].sort((first, second) => second.totalPoints - first.totalPoints);
}

function getQualifiedPlayers(rankedPlayers) {
	return rankedPlayers.slice(0, 4);
}

module.exports = {
	calculateMatchPoints,
	calculateBo2TotalPoints,
	rankPlayersByPoints,
	getQualifiedPlayers,
};
