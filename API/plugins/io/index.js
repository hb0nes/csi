const io = require('socket.io')(3001);

io.sockets.on('connection', function (socket) {
    // data is username of person who went to view their messages
    socket.on('join', function (data) {
        if (data) {
            socket.join(data); // join private room
        }
    });
});

module.exports = io;