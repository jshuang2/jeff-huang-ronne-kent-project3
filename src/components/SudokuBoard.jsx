import { useContext } from "react";
import { sudokuContext } from "./SudokuProvider";
import SudokuCell from "./SudokuCell";
import "./SudokuBoard.css";

export default function SudokuBoard() {

  const sudokuDataAndFuncs = useContext(sudokuContext);
  const cells = sudokuDataAndFuncs.cellsState;
  const won = sudokuDataAndFuncs.wonState;
  const timer = sudokuDataAndFuncs.timer;
  const resetGame = sudokuDataAndFuncs.resetGame;
  const startNewGame = sudokuDataAndFuncs.startNewGame;

  const size = sudokuDataAndFuncs.size;
  const boxRows = size === 9 ? 3 : 2;
  const boxCols = size === 9 ? 3 : 3;

  const boardComponent = cells.map((row, rowIdx) => {
    return (
      <div className="sudoku-row" key={rowIdx}>
        {row.map((cell, colIdx) => {
          const borderRight = (colIdx + 1) % boxCols === 0 && colIdx + 1 < size;
          const borderBottom = (rowIdx + 1) % boxRows === 0 && rowIdx + 1 < size;
          return (
            <SudokuCell
              row={rowIdx}
              col={colIdx}
              key={`${rowIdx}-${colIdx}`}
              borderRight={borderRight}
              borderBottom={borderBottom}
            />
          );
        })}
      </div>
    );
  });

  return (
    <div className="sudoku-board-container">

      <div className="sudoku-timer">{timer}</div>

      {won && <div className="sudoku-win-message">🎉 Congratulations! You solved it!</div>}

      <div className="sudoku-board">
        {boardComponent}
      </div>

      <div className="sudoku-controls">
        <button onClick={resetGame}>Reset</button>
        <button onClick={startNewGame}>New Game</button>
      </div>

    </div>
  );
}