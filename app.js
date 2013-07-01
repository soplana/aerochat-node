var io = require('socket.io').listen(8080);

var chat = io.sockets.on('connection', function (socket){

    socket.emit('connected');

    socket.on('joinRoom', function(data){
        socket.join(data.room);
        chat.in(data.room).emit('newMember', data.name);
    });
    
    socket.on('say', function(data){
        chat.in(data.room).emit('messageCatch', data.message);
    });
});
