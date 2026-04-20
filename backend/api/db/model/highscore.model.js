import mongoose from "mongoose";
import HighscoreSchema from "../schema/highscore.schema.js";

const HighscoreModel = mongoose.model("Highscore", HighscoreSchema);

export function insertHighscore(highscore) {
    return HighscoreModel.create(highscore);
}

export function getAllHighscores() {
    return HighscoreModel.find().exec();
}

export function findHighscoresByUsername(username) {
    return HighscoreModel.find({ username: username }).exec();
}

export function findHighscoresByGameId(gameId) {
    return HighscoreModel.find({ gameId: gameId }).exec();
}

export function updateHighscore(username, gameId, update) {
    return HighscoreModel.findOneAndUpdate(
        { username: username, gameId: gameId },
        update,
        { new: true, upsert: true }
    ).exec();
}

export function getLeaderboard() {
    return HighscoreModel.aggregate([
        { $match: { completed: true } },
        {
            $group: {
                _id: "$username",
                wins: { $sum: 1 },
            },
        },
        { $match: { wins: { $gt: 0 } } },
        { $sort: { wins: -1, _id: 1 } },
        {
            $project: {
                _id: 0,
                username: "$_id",
                wins: 1,
            },
        },
    ]).exec();
}
