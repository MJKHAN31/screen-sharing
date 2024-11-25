const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const server = require('https').createServer({
  key: fs.readFileSync('selfsigned.key'),
  cert: fs.readFileSync('selfsigned.crt'),
}, app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));



io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('offer', (offer) => {
    console.log('Offer received:', offer);
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    console.log('Answer received:', answer);
    socket.broadcast.emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate) => {
    console.log('ICE candidate received:', candidate);
    socket.broadcast.emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    socket.broadcast.emit('user-disconnected');
  });
});


const PORT = 3123;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on https://66.228.42.137:${PORT}`);
});
