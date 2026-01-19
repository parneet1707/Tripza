const socketIo = require('socket.io');

let io;

// Initialize the socket.io server
function init(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
}

// Send a message to a specific socket ID
function sendMessageToSocketId(socketId, message) {
    if (io && io.sockets.sockets.get(socketId)) {
        io.to(socketId).emit('message', message);
    } else {
        console.log('Socket ID not found:', socketId);
    }
}

module.exports = {
    init,
    sendMessageToSocketId
};