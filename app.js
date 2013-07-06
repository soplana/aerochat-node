var io = require('socket.io').listen(8080);
var mongo = require('mongoose');

// DB
mongo.connect('mongodb://localhost/aerochat_dev');
var Schema = mongo.Schema, ObjectId = Schema.ObjectId;

var User = new Schema({
    _id  : ObjectId,
    name : String,
    room : String,
    key  : String
});

var UserModel = mongo.model('User', User);

// socket
var chat = io.sockets.on('connection', function (socket){

    socket.emit('connected');


    socket.on('joining', function(data){
        var client  = socket.join(data.room), 
            clients = chat.clients(data.room),
            members = [];

        var userModel = new UserModel();
        userModel.name = data.name;
        userModel.room = data.room;
        userModel.key  = socket.id;
        userModel.save(function(){
            socket.emit('joined', userModel);
            
            members = UserModel.find({room : data.room});
            members = members.exec(function(err, docs){
                chat.in(data.room).emit('welcomed', {
                    welcomedUser: userModel,
                    members: docs
                });
            });
        });
    });
    
    socket.on('saying', function(data){
        chat.in(data.room).emit('catched', {name: data.name, message: data.message});
    });
    
    socket.on('disconnect', function(){
        UserModel.findOne({key : socket.id}).exec(function(err, doc){
            chat.in(doc.room).emit('left', {user: doc});
            doc.remove();
        });
    });

    socket.on('mouseDowning', function(data){
        chat.in(data.user.room).emit('mouseDowned', data);
    });

    socket.on('mouseMoving', function(data){
        chat.in(data.user.room).emit('mouseMoved', data);
    });

    socket.on('mouseUpping', function(data){
        chat.in(data.user.room).emit('mouseUpped', data);
    });
});
