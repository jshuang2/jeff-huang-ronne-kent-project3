import { useEffect, useState } from "react";
import { sudokuContext } from "./sudokuContext";

function cloneCells(cells) {
  return cells.map((row) => row.map((cell) => ({ ...cell })));
}

function boardFromCells(cells) {
  return cells.map((row) => row.map((cell) => Number(cell.value) || 0));
}

function cellsFromBoard(board, puzzle, solution) {
  return board.map((row, rowIndex) =>
    row.map((value, colIndex) => ({
      value: value === 0 ? "" : String(value),
      prefilled: puzzle[rowIndex][colIndex] !== 0,
      isCorrect: value === 0 || value === solution[rowIndex][colIndex],
      answer: solution[rowIndex][colIndex],
    }))
  );
}

function isSolved(board, solution) {
  return board.every((row, rowIndex) =>
    row.every((value, colIndex) => value === solution[rowIndex][colIndex])
  );
}

export default function SudokuProvider(props) {
  const size = props.mode === "easy" ? 6 : 9;
  const filledCount = props.mode === "easy" ? 18 : 29;
  const allowInteraction = props.allowInteraction ?? true;

  const [cellsState, setCellsState] = useState([]);
  const [originalState, setOriginalState] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [wonState, setWonState] = useState(false);
  const [secondsState, setSecondsState] = useState(0);

  useEffect(() => {
    if (props.game) {
      const activeBoard = props.showSolution
        ? props.game.solution
        : (props.game.currentBoard || props.game.puzzle);
      const nextCells = cellsFromBoard(
        activeBoard,
        props.game.puzzle,
        props.game.solution
      );

      setCellsState(nextCells);
      setOriginalState(
        cellsFromBoard(props.game.puzzle, props.game.puzzle, props.game.solution)
      );
      setSelectedState(null);
      setWonState(props.showSolution || isSolved(activeBoard, props.game.solution));
      setSecondsState(0);
      return;
    }

    startNewGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.game, props.showSolution]);

  useEffect(() => {
    if (wonState) return;
    const interval = setInterval(() => {
      setSecondsState((s) => s + 1);
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
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]
            .slice(0, size)
            .sort(() => Math.random() - 0.5);

          for (const num of nums) {
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
    if (props.game) return;

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
    setOriginalState(cloneCells(newCells));
    setSelectedState(null);
    setWonState(false);
    setSecondsState(0);
  }

  function resetGame() {
    if (!allowInteraction) return;

    const resetCells = cloneCells(originalState);

    setCellsState(resetCells);
    setSelectedState(null);
    setWonState(false);
    setSecondsState(0);

    props.onBoardChange?.({
      currentBoard: boardFromCells(resetCells),
      completed: false,
    });
  }

  function selectCell(row, col) {
    if (!allowInteraction) return;
    if (wonState || cellsState[row][col].prefilled) return;
    setSelectedState({ row, col });
  }

  function enterValue(num) {
    if (!allowInteraction) return;
    if (!selectedState || wonState) return;

    const { row, col } = selectedState;
    if (cellsState[row][col].prefilled) return;

    const newCells = cellsState.map((r) => r.map((c) => ({ ...c })));
    newCells[row][col].value = String(num);

    const numericBoard = newCells.map((r, ri) =>
      r.map((c, ci) => (ri === row && ci === col) ? 0 : parseInt(c.value) || 0)
    );
    newCells[row][col].isCorrect = isValid(numericBoard, row, col, num);

    setCellsState(newCells);

    const currentBoard = boardFromCells(newCells);
    const allDone = newCells.every((boardRow) =>
      boardRow.every((cell) => cell.value !== "" && cell.isCorrect)
    );

    props.onBoardChange?.({
      currentBoard,
      completed: allDone,
    });

    if (allDone) setWonState(true);
  }

  function deleteValue() {
    if (!allowInteraction) return;
    if (!selectedState || wonState) return;

    const { row, col } = selectedState;
    if (cellsState[row][col].prefilled) return;

    const newCells = cellsState.map((r) => r.map((c) => ({ ...c })));
    newCells[row][col].value = "";
    newCells[row][col].isCorrect = true;
    setCellsState(newCells);

    props.onBoardChange?.({
      currentBoard: boardFromCells(newCells),
      completed: false,
    });
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
    allowInteraction: allowInteraction,
    gameBacked: Boolean(props.game),
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
