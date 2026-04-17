import { Schema } from "mongoose";

const HighscoreSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    gameId: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, {
    collection: "highscores"
});

export default HighscoreSchema;