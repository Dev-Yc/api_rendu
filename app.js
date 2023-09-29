const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('play', (data) => {
        socket.broadcast.emit('play', data);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const port = process.env.PORT || 3030;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
