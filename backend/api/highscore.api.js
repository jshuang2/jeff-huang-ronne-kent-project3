import express from 'express';
import { verifyAuthCookie } from './user.api.js';
import { findSudokuById } from './db/model/sudoku.model.js';
import {
    findHighscoresByGameId,
    getLeaderboard,
    updateHighscore,
} from './db/model/highscore.model.js';

const router = express.Router();

function getCookieUsername(req) {
    return verifyAuthCookie(req);
}

// GET /api/highscore - get all high scores
router.get('/', async function(req, res) {
    try {
        const leaderboard = await getLeaderboard();
        res.json(leaderboard);
    } catch {
        res.status(500).json({ error: 'Unable to load high scores.' });
    }
});

// POST /api/highscore - update high score for a game
router.post('/', async function(req, res) {
    try {
        const username = req.body?.username || getCookieUsername(req);
        const gameId = req.body?.gameId;

        if (!username) {
            return res.status(401).json({ error: 'A logged-in username is required to record a win.' });
        }

        if (!gameId) {
            return res.status(400).json({ error: 'gameId is required.' });
        }

        const game = await findSudokuById(gameId);
        if (!game) {
            return res.status(404).json({ error: 'Game not found.' });
        }

        const savedScore = await updateHighscore(username, gameId, {
            username,
            gameId,
            completed: true,
        });

        return res.status(201).json({
            username: savedScore.username,
            gameId: savedScore.gameId,
            completed: savedScore.completed,
        });
    } catch {
        return res.status(500).json({ error: 'Unable to update high score.' });
    }
});

// GET /api/highscore/:gameId - get high score for a specific game
router.get('/:gameId', async function(req, res) {
    try {
        const game = await findSudokuById(req.params.gameId);
        if (!game) {
            return res.status(404).json({ error: 'Game not found.' });
        }

        const gameScores = await findHighscoresByGameId(req.params.gameId);
        const completedUsers = gameScores
            .filter((score) => score.completed)
            .map((score) => score.username)
            .sort((left, right) => left.localeCompare(right));

        return res.json({
            gameId: req.params.gameId,
            completions: completedUsers.length,
            usernames: completedUsers,
        });
    } catch {
        return res.status(500).json({ error: 'Unable to load game high scores.' });
    }
});

export default router;
