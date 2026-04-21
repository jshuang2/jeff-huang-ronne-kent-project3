import express from 'express';
import { verifyAuthCookie } from './user.api.js';
import {
    deleteSudoku,
    findSudokuById,
    getAllSudoku,
    insertSudoku,
    updateSudoku,
} from './db/model/sudoku.model.js';
import {
    generatePuzzle,
    generateUniqueGameName,
    isValidBoardShape,
} from '../utils.js';
import { updateHighscore } from './db/model/highscore.model.js';

const router = express.Router();

function getCookieUsername(req) {
    return verifyAuthCookie(req);
}

function serializeGameSummary(game) {
    return {
        id: game._id,
        name: game.name,
        difficulty: game.difficulty,
        createdBy: game.createdBy,
        createdAt: game.createdAt,
    };
}

// GET /api/sudoku - get all games
router.get('/', async function(req, res) {
    try {
        const games = await getAllSudoku();
        res.json(games.map(serializeGameSummary));
    } catch {
        res.status(500).json({ error: 'Unable to load Sudoku games.' });
    }
});

// GET /api/sudoku/:gameId - get full game data
router.get('/:gameId', async function(req, res) {
    try {
        const game = await findSudokuById(req.params.gameId);

        if (!game) {
            return res.status(404).json({ error: 'Game not found.' });
        }

        return res.json({
            id: game._id,
            name: game.name,
            difficulty: game.difficulty,
            puzzle: game.puzzle,
            currentBoard: game.currentBoard,
            solution: game.solution,
            createdBy: game.createdBy,
            createdAt: game.createdAt,
            completedBy: game.completedBy,
            isCompleted: game.completedBy.includes(getCookieUsername(req) || ''),
        });
    } catch {
        return res.status(500).json({ error: 'Unable to load Sudoku game.' });
    }
});

// POST /api/sudoku - create a new game
router.post('/', async function(req, res) {
    try {
        const difficulty = String(req.body?.difficulty || '').toLowerCase();

        if (!['easy', 'normal'].includes(difficulty)) {
            return res.status(400).json({ error: 'Difficulty must be easy or normal.' });
        }

        const existingGames = await getAllSudoku();
        const existingNames = new Set(existingGames.map((game) => game.name));
        const generatedGame = generatePuzzle(difficulty);

        const createdGame = await insertSudoku({
            name: generateUniqueGameName(existingNames),
            difficulty,
            ...generatedGame,
            createdBy: getCookieUsername(req) || 'anonymous',
        });

        return res.status(201).json({
            gameId: createdGame._id,
            name: createdGame.name,
        });
    } catch {
        return res.status(500).json({ error: 'Unable to create Sudoku game.' });
    }
});

// PUT /api/sudoku/:gameId - update a game
router.put('/:gameId', async function(req, res) {
    try {
        const game = await findSudokuById(req.params.gameId);

        if (!game) {
            return res.status(404).json({ error: 'Game not found.' });
        }

        const update = {};

        if (req.body.currentBoard !== undefined) {
            if (!isValidBoardShape(req.body.currentBoard, game.difficulty)) {
                return res.status(400).json({ error: 'Board shape is invalid for this difficulty.' });
            }

            update.currentBoard = req.body.currentBoard;
        }

        if (req.body.completed === true) {
            const username = getCookieUsername(req);

            if (!username) {
                return res.status(401).json({ error: 'You must be logged in to complete a game.' });
            }

            update.completedBy = game.completedBy.includes(username)
                ? game.completedBy
                : [...game.completedBy, username];

            await updateHighscore(username, req.params.gameId, {
                username,
                gameId: req.params.gameId,
                completed: true,
            });
        }

        const updatedGame = await updateSudoku(req.params.gameId, update);

        return res.json({
            id: updatedGame._id,
            name: updatedGame.name,
            difficulty: updatedGame.difficulty,
            puzzle: updatedGame.puzzle,
            currentBoard: updatedGame.currentBoard,
            solution: updatedGame.solution,
            createdBy: updatedGame.createdBy,
            createdAt: updatedGame.createdAt,
            completedBy: updatedGame.completedBy,
        });
    } catch {
        return res.status(500).json({ error: 'Unable to update Sudoku game.' });
    }
});

// DELETE /api/sudoku/:gameId - delete a game
router.delete('/:gameId', async function(req, res) {
    try {
        const deletedGame = await deleteSudoku(req.params.gameId);

        if (!deletedGame) {
            return res.status(404).json({ error: 'Game not found.' });
        }

        return res.status(204).send();
    } catch {
        return res.status(500).json({ error: 'Unable to delete Sudoku game.' });
    }
});

export default router;
