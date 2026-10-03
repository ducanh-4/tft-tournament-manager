const express = require('express');

const {
	getTournamentPlayers,
	registerTournamentPlayer,
} = require('../controllers/tournamentRegistrationController');

const router = express.Router();

router.get('/:id/players', getTournamentPlayers);
router.post('/:id/players', registerTournamentPlayer);

module.exports = router;