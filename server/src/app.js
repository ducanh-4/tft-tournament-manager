const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {
	getTournaments,
	getTournament,
	createNewTournament,
} = require('./controllers/tournamentController');

const playerRoutes = require('./routes/playerRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
	return res.json({
		success: true,
		message: 'TFT Tournament Manager API is running',
	});
});

app.get('/api/tournaments', getTournaments);
app.get('/api/tournaments/:id', getTournament);
app.post('/api/tournaments', createNewTournament);

app.use('/api/players', playerRoutes);

module.exports = app;