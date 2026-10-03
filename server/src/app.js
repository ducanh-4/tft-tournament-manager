const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { isValidPlayerCount } = require('./utils/tournamentRules');

const app = express();
const tournaments = [];

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
	res.json({
		success: true,
		message: 'TFT Tournament Manager API is running',
	});
});

app.get('/api/tournaments', (req, res) => {
	res.json({
		success: true,
		data: tournaments,
	});
});

app.post('/api/tournaments', (req, res) => {
	const { name, playerCount } = req.body;

	if (typeof name !== 'string' || name.trim() === '') {
		return res.status(400).json({
			success: false,
			message: 'Tournament name is required',
		});
	}

	if (!isValidPlayerCount(playerCount)) {
		return res.status(400).json({
			success: false,
			message: 'Invalid tournament player count',
		});
	}

	const tournament = {
		id: tournaments.length + 1,
		name: name.trim(),
		playerCount,
		status: 'DRAFT',
	};

	tournaments.push(tournament);

	return res.status(201).json({
		success: true,
		data: tournament,
	});
});

module.exports = app;