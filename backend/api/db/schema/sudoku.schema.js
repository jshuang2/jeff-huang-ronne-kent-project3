import { Schema } from "mongoose";

const SudokuSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    difficulty: {
        type: String,
        enum: ["easy", "normal"],
        required: true,
    },
    puzzle: {
        type: [[Number]],
        required: true,
    },
    currentBoard: {
        type: [[Number]],
        required: true,
    },
    solution: {
        type: [[Number]],
        required: true,
    },
    createdBy: {
        type: String,
        default: "anonymous",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    completedBy: {
        type: [String],
        default: [],
    },
}, {
    collection: "sudoku"
});

export default SudokuSchema;
