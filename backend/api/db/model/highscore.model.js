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