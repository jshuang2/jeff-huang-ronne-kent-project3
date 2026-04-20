import mongoose from "mongoose";
import SudokuSchema from "../schema/sudoku.schema.js";

const SudokuModel = mongoose.model("Sudoku", SudokuSchema);

export function insertSudoku(sudoku) {
    return SudokuModel.create(sudoku);
}

export function getAllSudoku() {
    return SudokuModel.find().sort({ createdAt: -1 }).exec();
}

export function findSudokuById(id) {
    return SudokuModel.findById(id).exec();
}

export function updateSudoku(id, update) {
    return SudokuModel.findByIdAndUpdate(id, update, { new: true }).exec();
}

export function deleteSudoku(id) {
    return SudokuModel.findByIdAndDelete(id).exec();
}
