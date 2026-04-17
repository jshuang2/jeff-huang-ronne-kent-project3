import { createContext, useEffect, useState } from "react";

export const sudokuContext = createContext();

export default function SudokuProvider(props) {

  const size = props.mode === "easy" ? 6 : 9;
  const filledCount = props.mode === "easy" ? 18 : 29;

  const [cellsState, setCellsState] = useState([]);
  const [originalState, setOriginalState] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [wonState, setWonState] = useState(false);
  const [secondsState, setSecondsState] = useState(0);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (wonState) return;
    const interval = setInterval(() => {
      setSecondsState(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [wonState]);


  // --- Board Generation ---

  function isValid(board, row, col, num) {
    const boxRows = size === 9 ? 3 : 2;
    const boxCols = size === 9 ? 3 : 3;

    for (let i = 0; i < size; i++) {
      if (board[row][i] === num) return false;
      if (board[i][col] === num) return false;
    }

    const startRow = Math.floor(row / boxRows) * boxRows;
    const startCol = Math.floor(col / boxCols) * boxCols;

    for (let r = startRow; r < startRow + boxRows; r++) {
      for (let c = startCol; c < startCol + boxCols; c++) {
        if (board[r][c] === num) return false;
      }
    }

    return true;
  }

  function solveBoard(board) {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === 0) {
          const nums = [1,2,3,4,5,6,7,8,9].slice(0, size).sort(() => Math.random() - 0.5);

          for (let num of nums) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solveBoard(board)) return true;
              board[row][col] = 0;
            }
          }

          return false;
        }
      }
    }
    return true;
  }

  function generatePuzzle() {
    const board = [];

    for (let i = 0; i < size; i++) {
      board.push([]);
      for (let j = 0; j < size; j++) {
        board[i].push(0);
      }
    }

    solveBoard(board);
    const solution = board.map(row => [...row]);

    let toRemove = size * size - filledCount;
    let attempts = 0;
    while (toRemove > 0 && attempts < 200) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      if (board[r][c] !== 0) {
        const backup = board[r][c];
        board[r][c] = 0;

        const testBoard = board.map(row => [...row]);
        if (solveBoard(testBoard)) {
          toRemove--;
        } else {
          board[r][c] = backup;
        }
      }
      attempts++;
    }

    return { puzzle: board, solution };
  }


  // --- Game Actions ---

  function startNewGame() {
    const { puzzle, solution } = generatePuzzle();
    const newCells = [];

    for (let r = 0; r < size; r++) {
      newCells.push([]);
      for (let c = 0; c < size; c++) {
        const val = puzzle[r][c];
        newCells[r].push({
          value: val === 0 ? "" : String(val),
          prefilled: val !== 0,
          isCorrect: true,
          answer: solution[r][c],
        });
      }
    }

    setCellsState(newCells);
    setOriginalState(newCells.map(row => row.map(cell => ({ ...cell }))));
    setSelectedState(null);
    setWonState(false);
    setSecondsState(0);
  }

  function resetGame() {
    setCellsState(originalState.map(row => row.map(cell => ({ ...cell }))));
    setSelectedState(null);
    setWonState(false);
    setSecondsState(0);
  }

  function selectCell(row, col) {
    if (wonState || cellsState[row][col].prefilled) return;
    setSelectedState({ row, col });
  }

  function enterValue(num) {
    if (!selectedState || wonState) return;

    const { row, col } = selectedState;
    if (cellsState[row][col].prefilled) return;

    const newCells = cellsState.map(r => r.map(c => ({ ...c })));
    newCells[row][col].value = String(num);

    const numericBoard = newCells.map((r, ri) =>
      r.map((c, ci) => (ri === row && ci === col) ? 0 : parseInt(c.value) || 0)
    );
    newCells[row][col].isCorrect = isValid(numericBoard, row, col, num);

    setCellsState(newCells);

    const allDone = newCells.every(row => row.every(cell => cell.value !== "" && cell.isCorrect));
    if (allDone) setWonState(true);
  }

  function deleteValue() {
    if (!selectedState || wonState) return;

    const { row, col } = selectedState;
    if (cellsState[row][col].prefilled) return;

    const newCells = cellsState.map(r => r.map(c => ({ ...c })));
    newCells[row][col].value = "";
    newCells[row][col].isCorrect = true;
    setCellsState(newCells);
  }


  // --- Helpers ---

  function formatTime(s) {
    const mins = Math.floor(s / 60).toString().padStart(2, "0");
    const secs = (s % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }


  // --- Context Value ---

  const globalDataAndFunctions = {
    cellsState: cellsState,
    selectedState: selectedState,
    wonState: wonState,
    size: size,
    timer: formatTime(secondsState),
    selectCell: selectCell,
    enterValue: enterValue,
    deleteValue: deleteValue,
    resetGame: resetGame,
    startNewGame: startNewGame,
  };

  return (
    <sudokuContext.Provider value={globalDataAndFunctions}>
      {props.children}
    </sudokuContext.Provider>
  );
}