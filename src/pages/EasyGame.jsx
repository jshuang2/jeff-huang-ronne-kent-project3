import SudokuProvider from "../components/SudokuProvider";
import SudokuBoard from "../components/SudokuBoard";

export default function EasyGame() {
  return (
    <div className="content">
      <h1>Easy Sudoku</h1>
      <SudokuProvider mode="easy">
        <SudokuBoard />
      </SudokuProvider>
    </div>
  );
}