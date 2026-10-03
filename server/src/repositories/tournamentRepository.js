const prisma = require('../lib/prisma');

async function findAll() {
	return prisma.tournament.findMany({
		orderBy: {
			id: 'desc',
		},
	});
}

async function findById(id) {
	return prisma.tournament.findUnique({
		where: {
			id,
		},
	});
}

async function create(data) {
	return prisma.tournament.create({
		data,
	});
}

module.exports = {
	findAll,
	findById,
	create,
};