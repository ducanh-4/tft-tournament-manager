const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {
	getTournaments,
	getTournament,
	createNewTournament,
} = require('./controllers/tournamentController');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
	res.json({
		success: true,
		message: 'TFT Tournament Manager API is running',
	});
});

app.get('/api/tournaments', getTournaments);

app.get('/api/tournaments/:id', getTournament);

app.post('/api/tournaments', createNewTournament);

module.exports = app;