import { useContext } from "react";
import { sudokuContext } from "./SudokuProvider";
import "./SudokuCell.css";

export default function SudokuCell(props) {

  const sudokuDataAndFuncs = useContext(sudokuContext);
  const cells = sudokuDataAndFuncs.cellsState;
  const selected = sudokuDataAndFuncs.selectedState;
  const selectCell = sudokuDataAndFuncs.selectCell;
  const enterValue = sudokuDataAndFuncs.enterValue;
  const deleteValue = sudokuDataAndFuncs.deleteValue;

  const row = props.row;
  const col = props.col;
  const borderRight = props.borderRight;
  const borderBottom = props.borderBottom;
  const cell = cells[row][col];

  const isSelected = selected && selected.row === row && selected.col === col;

  function getCellClass() {
    if (cell.prefilled) return "sudoku-cell prefilled";
    if (!cell.isCorrect) return "sudoku-cell incorrect";
    if (isSelected) return "sudoku-cell selected";
    return "sudoku-cell";
  }

  function handleClick() {
    selectCell(row, col);
  }

  function handleKeyDown(e) {
    const num = parseInt(e.key);
    if (num >= 1 && num <= sudokuDataAndFuncs.size) {
      enterValue(num);
    } else if (e.key === "Backspace" || e.key === "Delete") {
      deleteValue();
    }
  }

  const borderStyle = {
    borderRight: borderRight ? "3px solid #333" : undefined,
    borderBottom: borderBottom ? "3px solid #333" : undefined,
  };

  return (
    <div
      className={getCellClass()}
      style={borderStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={cell.prefilled ? -1 : 0}
    >
      {cell.value}
    </div>
  );
}