import express from 'express';
import jwt from 'jsonwebtoken';
import { insertUser, findUserByUsername } from './db/model/user.model.js';

const router = express.Router();

// Create and attach a JWT cookie to the response
function setAuthCookie(res, username) {
    const token = jwt.sign(
        { username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours in ms
    });
}

// Verify the JWT token from the cookie
export function verifyAuthCookie(req) {
    try {
        const token = req.cookies?.token;
        if (!token) return null;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.username;
    } catch {
        return null;
    }
}

// POST /api/user/register
router.post('/register', async function(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists.' });
        }

        await insertUser({ username, password });

        setAuthCookie(res, username);

        return res.status(201).json({ username });
    } catch {
        return res.status(500).json({ error: 'Unable to register user.' });
    }
});

// POST /api/user/login
router.post('/login', async function(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        const user = await findUserByUsername(username);
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        setAuthCookie(res, username);

        return res.json({ username });
    } catch {
        return res.status(500).json({ error: 'Unable to login.' });
    }
});

// GET /api/user/isLoggedIn
router.get('/isLoggedIn', async function(req, res) {
    const username = verifyAuthCookie(req);
    if (!username) {
        return res.status(401).json({ error: 'Not logged in.' });
    }
    return res.json({ username });
});

// POST /api/user/logout
router.post('/logout', async function(req, res) {
    res.clearCookie('token');
    return res.json({ message: 'Logged out.' });
});

export default router;