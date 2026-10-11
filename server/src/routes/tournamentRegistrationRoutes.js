
const express = require('express');

const {
        getTournamentPlayers,
        registerTournamentPlayer,
} = require('../controllers/tournamentRegistrationController');

const {
        getTournamentRoundsById,
        createTournamentRound,
} = require('../controllers/roundController');

const router = express.Router();

router.get('/:id/players', getTournamentPlayers);
router.post('/:id/players', registerTournamentPlayer);
router.get('/:id/rounds', getTournamentRoundsById);
router.post('/:id/rounds', createTournamentRound);

module.exports = router;
