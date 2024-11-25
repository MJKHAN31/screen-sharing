const https = require('https');
const fs = require('fs');
const express = require('express');
const { Server } = require('socket.io');
const path = require('path');

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Load SSL certificate and key
const options = {
    key: fs.readFileSync('selfsigned.key'),
    cert: fs.readFileSync('selfsigned.crt'),
};

// Create HTTPS server
const server = https.createServer(options, app);

// Initialize Socket.IO
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('screen-data', (data) => {
        socket.broadcast.emit('screen-data', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

const PORT = 3123;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on https://66.228.42.137:${PORT}`);
});
