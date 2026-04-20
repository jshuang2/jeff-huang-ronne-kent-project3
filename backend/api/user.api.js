import express from 'express';
const router = express.Router();

router.post('/register', async function(_req, res) {
    res.status(501).json({ error: 'TODO-JEFF: register API not implemented yet.' });
});

router.post('/login', async function(_req, res) {
    res.status(501).json({ error: 'TODO-JEFF: login API not implemented yet.' });
});

router.get('/isLoggedIn', async function(_req, res) {
    res.status(501).json({ error: 'TODO-JEFF: auth status API not implemented yet.' });
});

router.delete('/logout', async function(_req, res) {
    res.status(501).json({ error: 'TODO-JEFF: logout API not implemented yet.' });
});



export default router;
