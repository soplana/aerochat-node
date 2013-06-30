var io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket){
    socket.emit('connected');
    
    socket.on('welcome', function (message) {
        socket.broadcast.emit('newMember', message);
    });
});
