const prisma = require('../lib/prisma');

async function findPlayersByTournamentId(tournamentId) {
	return prisma.tournamentPlayer.findMany({
		where: {
			tournamentId,
		},
		include: {
			player: true,
		},
		orderBy: {
			id: 'asc',
		},
	});
}

async function findRegistration(tournamentId, playerId) {
	return prisma.tournamentPlayer.findUnique({
		where: {
			tournamentId_playerId: {
				tournamentId,
				playerId,
			},
		},
	});
}

async function create(tournamentId, playerId) {
	return prisma.tournamentPlayer.create({
		data: {
			tournamentId,
			playerId,
		},
		include: {
			player: true,
		},
	});
}

async function countByTournamentId(tournamentId) {
	return prisma.tournamentPlayer.count({
		where: {
			tournamentId,
		},
	});
}

module.exports = {
	findPlayersByTournamentId,
	findRegistration,
	create,
	countByTournamentId,
};