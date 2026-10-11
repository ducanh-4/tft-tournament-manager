
const express = require('express');

const {
  createMatchResults,
  getMatchResultsById,
} = require('../controllers/matchResultController');

const router = express.Router();

router.get('/:matchId/results', getMatchResultsById);
router.post('/:matchId/results', createMatchResults);

module.exports = router;
