const express = require('express');

const {
	getPlayers,
	getPlayer,
	createNewPlayer,
} = require('../controllers/playerController');

const router = express.Router();

router.get('/', getPlayers);
router.get('/:id', getPlayer);
router.post('/', createNewPlayer);

module.exports = router;