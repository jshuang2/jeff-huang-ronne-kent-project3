import express from 'express';
const router = express.Router();

// GET /api/sudoku - get all games
router.get('/', async function(req, res) {
    res.json({ message: 'TODO: get all games' });
});

// POST /api/sudoku - create a new game
router.post('/', async function(req, res) {
    res.json({ message: 'TODO: create new game' });
});

// PUT /api/sudoku/:gameId - update a game
router.put('/:gameId', async function(req, res) {
    res.json({ message: 'TODO: update game' });
});

// DELETE /api/sudoku/:gameId - delete a game
router.delete('/:gameId', async function(req, res) {
    res.json({ message: 'TODO: delete game' });
});

export default router;