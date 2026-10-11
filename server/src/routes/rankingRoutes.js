const express = require('express');

const { getRankings } = require('../controllers/rankingController');

const router = express.Router();

router.get('/', getRankings);

module.exports = router;
