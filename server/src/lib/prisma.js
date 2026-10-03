require('dotenv').config();

const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { PrismaClient } = require('../generated/prisma/client');

const adapter = new PrismaMariaDb({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'tft_tournament_manager',
	connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;