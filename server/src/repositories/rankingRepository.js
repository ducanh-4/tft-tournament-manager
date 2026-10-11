const prisma = require('../lib/prisma');

async function findLobbyBo2({ tournamentId, roundId, lobbyId }) {
	return prisma.lobby.findFirst({
		where: {
			id: lobbyId,
			roundId,
			round: {
				is: {
					tournamentId,
				},
			},
		},
		select: {
			players: {
				orderBy: {
					playerId: 'asc',
				},
				select: {
					playerId: true,
					player: {
						select: {
							displayName: true,
						},
					},
				},
			},
			matches: {
				where: {
					gameNumber: {
						in: [1, 2],
					},
				},
				select: {
					gameNumber: true,
					status: true,
					results: {
						select: {
							playerId: true,
							placement: true,
							points: true,
						},
					},
				},
			},
		},
	});
}

module.exports = {
	findLobbyBo2,
};
