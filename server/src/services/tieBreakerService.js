function comparePlayersByRegionalTieBreakers(playerA, playerB) {
	if (playerA.firstPlaceCount !== playerB.firstPlaceCount) {
		return playerB.firstPlaceCount - playerA.firstPlaceCount;
	}

	if (playerA.totalPoints !== playerB.totalPoints) {
		return playerB.totalPoints - playerA.totalPoints;
	}

	if (playerA.top4Count !== playerB.top4Count) {
		return playerB.top4Count - playerA.top4Count;
	}

	if (playerA.lastPlaceCount !== playerB.lastPlaceCount) {
		return playerA.lastPlaceCount - playerB.lastPlaceCount;
	}

	if (playerA.latestPlacement !== playerB.latestPlacement) {
		return playerA.latestPlacement - playerB.latestPlacement;
	}

	if (playerA.secondPlaceCount !== playerB.secondPlaceCount) {
		return playerB.secondPlaceCount - playerA.secondPlaceCount;
	}

	if (playerA.thirdPlaceCount !== playerB.thirdPlaceCount) {
		return playerB.thirdPlaceCount - playerA.thirdPlaceCount;
	}

	return 0;
}

function rankPlayersByRegionalTieBreakers(players) {
	return [...players].sort(comparePlayersByRegionalTieBreakers);
}

module.exports = {
	comparePlayersByRegionalTieBreakers,
	rankPlayersByRegionalTieBreakers,
};