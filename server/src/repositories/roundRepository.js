const prisma = require('../lib/prisma');

async function findByTournamentId(tournamentId) {
	return prisma.round.findMany({
		where: {
			tournamentId,
		},
		include: {
			lobbies: {
				include: {
					players: {
						include: {
							player: true,
						},
					},
				},
				orderBy: {
					lobbyNumber: 'asc',
				},
			},
		},
		orderBy: {
			roundNumber: 'asc',
		},
	});
}

async function findById(id) {
	return prisma.round.findUnique({
		where: {
			id,
		},
		include: {
			lobbies: {
				include: {
					players: {
						include: {
							player: true,
						},
					},
				},
			},
		},
	});
}

async function create(data, client = prisma) {
	return client.round.create({
		data,
	});
}

async function createLobby(roundId, lobbyNumber, client = prisma) {
	return client.lobby.create({
		data: {
			roundId,
			lobbyNumber,
		},
	});
}

async function addPlayerToLobby(lobbyId, playerId, client = prisma) {
	return client.lobbyPlayer.create({
		data: {
			lobbyId,
			playerId,
		},
		include: {
			player: true,
		},
	});
}

module.exports = {
	findByTournamentId,
	findById,
	create,
	createLobby,
	addPlayerToLobby,
};
