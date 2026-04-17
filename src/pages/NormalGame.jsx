import SudokuProvider from "../components/SudokuProvider";
import SudokuBoard from "../components/SudokuBoard";

export default function NormalGame() {
  return (
    <div className="content">
      <h1>Normal Sudoku</h1>
      <SudokuProvider mode="normal">
        <SudokuBoard />
      </SudokuProvider>
    </div>
  );
}