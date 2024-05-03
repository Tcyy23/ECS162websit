let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const titlePage = document.getElementById('title-page');
const gamePage = document.getElementById('game-page');

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = `Player ${currentPlayer} has won!`;
        isGameActive = false;
        return;
    }

    let roundDraw = !board.includes('');
    if (roundDraw) {
        statusDisplay.innerHTML = 'Game ended in a draw!';
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
}

function makeMove(index) {
    if (board[index] !== '' || !isGameActive) {
        return;
    }

    board[index] = currentPlayer;
    cells[index].innerHTML = currentPlayer;
    handleResultValidation();
}

function startGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    cells.forEach(cell => cell.innerHTML = '');
    statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
}

function showGame() {
    titlePage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    startGame();
}

function showTitle() {
    gamePage.classList.add('hidden');
    titlePage.classList.remove('hidden');
    isGameActive = false;
}
