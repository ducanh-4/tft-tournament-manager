
const {
  submitMatchResults,
  getMatchResults,
} = require('../services/matchResultService');

async function createMatchResults(req, res) {
  try {
    const matchId = Number(req.params.matchId);
    const { results } = req.body;

    const data = await submitMatchResults(matchId, results);

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    const validationErrors = [
      'Invalid match id',
      'A match must have exactly 8 results',
      'Placements must be unique numbers from 1 to 8',
      'Player IDs must be unique positive integers',
      'Results must include every player in the lobby',
    ];

    if (error.message === 'Match not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (validationErrors.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Create match results error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to save match results',
    });
  }
}

async function getMatchResultsById(req, res) {
  try {
    const matchId = Number(req.params.matchId);
    const data = await getMatchResults(matchId);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    if (
      error.message === 'Match not found' ||
      error.message === 'Invalid match id'
    ) {
      return res.status(
        error.message === 'Match not found' ? 404 : 400
      ).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Get match results error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to get match results',
    });
  }
}

module.exports = {
  createMatchResults,
  getMatchResultsById,
};
