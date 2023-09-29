const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let currentPlayer = 'X';

function isGameOver(board, row, col) {
    const player = board[row][col];
    if (board[row].every(cell => cell === player)) return true;
    if (board.every(row => row[col] === player)) return true;
    if (row === col && board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
    if (row + col === 2 && board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;
    if (board.flat().every(cell => cell !== '')) return 'draw'; // retourne 'draw' si le tableau est plein
    return false;
}

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

io.on('connection', (socket) => {
    socket.on('play', (data) => {
        board[data.row][data.col] = currentPlayer;
        const gameResult = isGameOver(board, data.row, data.col);
        if (gameResult) {
            io.emit('gameOver', { winner: gameResult === 'draw' ? 'Draw' : currentPlayer });
            board = [
                ['', '', ''],
                ['', '', ''],
                ['', '', '']
            ];
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        io.emit('play', { ...data, player: currentPlayer });
    });
});

const port = process.env.PORT || 3030;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
