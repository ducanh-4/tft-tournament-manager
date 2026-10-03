const prisma = require('../lib/prisma');

async function findAll() {
	return prisma.player.findMany({
		orderBy: {
			id: 'desc',
		},
	});
}

async function findById(id) {
	return prisma.player.findUnique({
		where: {
			id,
		},
	});
}

async function create(data) {
	return prisma.player.create({
		data,
	});
}

async function findByDisplayName(displayName) {
	return prisma.player.findFirst({
		where: {
			displayName,
		},
	});
}

module.exports = {
	findAll,
	findById,
	create,
	findByDisplayName,
};