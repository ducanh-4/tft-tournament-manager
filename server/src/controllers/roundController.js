const {
        createRound,
} = require('../services/roundCreationService');

async function createTournamentRound(req, res) {
        try {
                const tournamentId = Number(req.params.id);

                if (!Number.isInteger(tournamentId) || tournamentId <= 0) {
                        return res.status(400).json({
                                success: false,
                                message: 'Invalid tournament id',
                        });
                }

                const round = await createRound(tournamentId);

                return res.status(201).json({
                        success: true,
                        data: round,
                });
        } catch (error) {
                if (error.message === 'Tournament not found') {
                        return res.status(404).json({
                                success: false,
                                message: error.message,
                        });
                }

                if (
                        error.message ===
                        'Registered player count does not match tournament player count'
                ) {
                        return res.status(400).json({
                                success: false,
                                message: error.message,
                        });
                }

                console.error('Create tournament round error:', error);

                return res.status(500).json({
                        success: false,
                        message: 'Failed to create tournament round',
                });
        }
}

module.exports = {
        createTournamentRound,
};
