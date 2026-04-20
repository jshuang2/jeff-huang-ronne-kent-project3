const WORD_PART_A = [
    "ba", "be", "bi", "bo", "bu",
    "ca", "ce", "ci", "co", "cu",
    "da"
];

const WORD_PART_B = [
    "la", "le", "li", "lo", "lu",
    "ra", "re", "ri", "ro", "ru",
    "na"
];

const WORD_PART_C = [
    "den", "fer", "gan", "hal", "jen",
    "kel", "len", "mor", "nel", "tor",
    "vin"
];

const WORD_BANK = WORD_PART_A.flatMap((partA) =>
    WORD_PART_B.flatMap((partB) =>
        WORD_PART_C.map((partC) => `${partA}${partB}${partC}`)
    )
);

export function randomNumberGenerator(max) {
    return Math.floor(Math.random() * max);
}

function getBoardConfig(difficulty) {
    if (difficulty === "easy") {
        return { size: 6, filledCount: 18, boxRows: 2, boxCols: 3 };
    }

    return { size: 9, filledCount: 29, boxRows: 3, boxCols: 3 };
}

function cloneBoard(board) {
    return board.map((row) => [...row]);
}

function isValidPlacement(board, row, col, num, boxRows, boxCols) {
    const size = board.length;

    for (let idx = 0; idx < size; idx += 1) {
        if (board[row][idx] === num) {
            return false;
        }

        if (board[idx][col] === num) {
            return false;
        }
    }

    const startRow = Math.floor(row / boxRows) * boxRows;
    const startCol = Math.floor(col / boxCols) * boxCols;

    for (let rowIdx = startRow; rowIdx < startRow + boxRows; rowIdx += 1) {
        for (let colIdx = startCol; colIdx < startCol + boxCols; colIdx += 1) {
            if (board[rowIdx][colIdx] === num) {
                return false;
            }
        }
    }

    return true;
}

function solveBoard(board, boxRows, boxCols) {
    const size = board.length;

    for (let row = 0; row < size; row += 1) {
        for (let col = 0; col < size; col += 1) {
            if (board[row][col] === 0) {
                const candidates = Array.from({ length: size }, (_, index) => index + 1)
                    .sort(() => Math.random() - 0.5);

                for (const candidate of candidates) {
                    if (isValidPlacement(board, row, col, candidate, boxRows, boxCols)) {
                        board[row][col] = candidate;

                        if (solveBoard(board, boxRows, boxCols)) {
                            return true;
                        }

                        board[row][col] = 0;
                    }
                }

                return false;
            }
        }
    }

    return true;
}

export function generatePuzzle(difficulty) {
    const { size, filledCount, boxRows, boxCols } = getBoardConfig(difficulty);
    const board = Array.from({ length: size }, () => Array(size).fill(0));

    solveBoard(board, boxRows, boxCols);

    const solution = cloneBoard(board);
    let toRemove = (size * size) - filledCount;
    let attempts = 0;

    while (toRemove > 0 && attempts < 500) {
        const row = randomNumberGenerator(size);
        const col = randomNumberGenerator(size);

        if (board[row][col] !== 0) {
            const previous = board[row][col];
            board[row][col] = 0;

            const testBoard = cloneBoard(board);
            if (solveBoard(testBoard, boxRows, boxCols)) {
                toRemove -= 1;
            } else {
                board[row][col] = previous;
            }
        }

        attempts += 1;
    }

    return {
        puzzle: board,
        solution,
        currentBoard: cloneBoard(board),
    };
}

function capitalizeWord(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function generateUniqueGameName(existingNames = new Set()) {
    let attempts = 0;

    while (attempts < 5000) {
        const candidate = Array.from({ length: 3 }, () =>
            capitalizeWord(WORD_BANK[randomNumberGenerator(WORD_BANK.length)])
        ).join(" ");

        if (!existingNames.has(candidate)) {
            return candidate;
        }

        attempts += 1;
    }

    return `Sudoku ${Date.now()}`;
}

export function isValidBoardShape(board, difficulty) {
    const { size } = getBoardConfig(difficulty);

    if (!Array.isArray(board) || board.length !== size) {
        return false;
    }

    return board.every((row) =>
        Array.isArray(row)
        && row.length === size
        && row.every((value) => Number.isInteger(value) && value >= 0 && value <= size)
    );
}
