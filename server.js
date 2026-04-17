import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';

import userRouter from './backend/api/user.api.js';
import sudokuRouter from './backend/api/sudoku.api.js';
import highscoreRouter from './backend/api/highscore.api.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', () => console.log('Connected to MongoDB!'));

// API routes
app.use('/api/user', userRouter);
app.use('/api/sudoku', sudokuRouter);
app.use('/api/highscore', highscoreRouter);

// Serve frontend
const frontend_dir = path.join(path.resolve(), 'dist');
app.use(express.static(frontend_dir));
app.get('*', function (req, res) {
    res.sendFile(path.join(frontend_dir, 'index.html'));
});

app.listen(process.env.PORT || 8000, function () {
    console.log('Starting server on port ' + (process.env.PORT || 8000));
});