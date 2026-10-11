
const prisma = require('../lib/prisma');
const tournamentRepository = require('../repositories/tournamentRepository');
const tournamentPlayerRepository = require('../repositories/tournamentPlayerRepository');
const roundRepository = require('../repositories/roundRepository');
const { createLobbies, getRoundInfo } = require('./tournamentService');

async function createRound(tournamentId) {
	const tournament = await tournamentRepository.findById(tournamentId);

	if (!tournament) {
		throw new Error('Tournament not found');
	}

	const registeredPlayers =
		await tournamentPlayerRepository.findPlayersByTournamentId(tournamentId);

	if (registeredPlayers.length !== tournament.playerCount) {
		throw new Error('Registered player count does not match tournament player count');
	}

	const roundInfo = getRoundInfo(tournament.playerCount);
	const existingRounds = await roundRepository.findByTournamentId(tournamentId);
	const roundNumber =
		existingRounds.reduce(
			(highestRoundNumber, round) => Math.max(highestRoundNumber, round.roundNumber),
			0,
		) + 1;

	const players = registeredPlayers.map((registration) => registration.player);
	const lobbyGroups = createLobbies(players);

	return prisma.$transaction(async (tx) => {
		const round = await roundRepository.create(
			{
				tournamentId,
				roundNumber,
				type: roundInfo.isFinal ? 'FINAL' : 'QUALIFIER',
			},
			tx,
		);

		const lobbies = [];

		for (let index = 0; index < lobbyGroups.length; index++) {
			const lobby = await roundRepository.createLobby(
				round.id,
				index + 1,
				tx,
			);
			const lobbyPlayers = [];

			for (const player of lobbyGroups[index]) {
				lobbyPlayers.push(
					await roundRepository.addPlayerToLobby(
						lobby.id,
						player.id,
						tx,
					),
				);
			}

			lobbies.push({
				...lobby,
				players: lobbyPlayers,
			});
		}

		return {
			...round,
			lobbies,
		};
	});
}

async function getTournamentRounds(tournamentId) {
	return roundRepository.findByTournamentId(tournamentId);
}

async function getRoundById(roundId) {
	const round = await roundRepository.findById(roundId);

	if (!round) {
		throw new Error('Round not found');
	}

	return round;
}

module.exports = {
	createRound,
	getTournamentRounds,
	getRoundById,
};
