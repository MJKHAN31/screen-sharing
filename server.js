const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // Serve static files for frontend

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for screen sharing data from a user
    socket.on('screen-data', (data) => {
        // Broadcast screen data to all other users
        socket.broadcast.emit('screen-data', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
