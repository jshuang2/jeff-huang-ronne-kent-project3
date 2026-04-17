import express from 'express';
const router = express.Router();

// GET /api/highscore - get all high scores
router.get('/', async function(req, res) {
    res.json({ message: 'TODO: get all high scores' });
});

// POST /api/highscore - update high score for a game
router.post('/', async function(req, res) {
    res.json({ message: 'TODO: update high score' });
});

// GET /api/highscore/:gameId - get high score for a specific game
router.get('/:gameId', async function(req, res) {
    res.json({ message: 'TODO: get high score for game' });
});

export default router;