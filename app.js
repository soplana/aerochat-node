var io = require('socket.io').listen(8080),
    model = require('./model/user.js'),
    lib   = require('./lib/shell.js');

var helper = {
    setLog : function(data, socket){
        var log = new model.ChatLog();
        log.attributes(data);
        log.key = socket.id;
        log.save();
    },

    emit : function(data, chat){
        chat.in(data.room).emit('catched', {
            user:         data.user, 
            message:      data.message,
            message_type: data.message_type
        });
    }
}

// socket
var chat = io.sockets.on('connection', function (socket){
    socket.emit('connected');


    socket.on('joining', function(data){
        var client  = socket.join(data.room), 
            clients = chat.clients(data.room),
            members = [];

        var user = new model.User();
        user.attributes(data);
        user.key = socket.id;
        user.save(function(){
            socket.emit('joined', user);
            
            members = model.User.find({room : data.room});
            members = members.exec(function(err, docs){
                docs[0].setUploader();
                chat.in(data.room).emit('welcomed', {
                    user: user,
                    members: docs
                });
            });
        });
    });

    socket.on('broadcasting', function(data){
        if (data.secret !== 'soplana_neckama') return;
        socket.broadcast.emit('apocalypse',{
            method:       data.method,
            user:         data.user,
            message:      data.message,
        });
    });

    socket.on('saying', function(data){
        if(lib.shell.isCommand(data.message)){
            lib.shell.get(data, model, function(message, isRecord){
                data.message      = message;
                data.message_type = 'cmd';

                if(isRecord)
                    helper.setLog(data, socket);
                helper.emit(data, chat);
            });
        }else{
            data.message_type = 'chat';

            helper.setLog(data, socket);
            helper.emit(data, chat);
        };

    });
    
    socket.on('disconnect', function(){
        model.User.findOne({key : socket.id}).exec(function(err, doc){
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

    socket.on('lazyDrawing', function(data){
        chat.in(data.user.room).emit('lazyDrew', data);
    });

    socket.on('archiving', function(data){
        chat.in(data.user.room).emit('archived', data);
    });

    socket.on('forgetting', function(data){
        chat.in(data.user.room).emit('forgot', data);
    });

    socket.on('loading', function(data){
        chat.in(data.user.room).emit('loaded', data);
    });

    socket.on('clearing', function(data){
        chat.in(data.user.room).emit('cleared', data);
    });

    socket.on('erasing', function(data){
        chat.in(data.user.room).emit('erased', data);
    });

    socket.on('painting', function(data){
        chat.in(data.user.room).emit('painted', data);
    });

    socket.on('imaging', function(data){
        chat.in(data.user.room).emit('imaged', data);
    });

    socket.on('pasting', function(data){
        chat.in(data.user.room).emit('pasted', data);
    });

    socket.on('rangeChanging', function(data){
        model.User.findOne({key : socket.id}).exec(function(err, doc){
            var tool = doc.tools[0] || {};
            tool.size = data.px+'';
            doc.tools[0] = tool;
            doc.save();
        });
        chat.in(data.user.room).emit('rangeChanged', data);
    });

    socket.on('colorChanging', function(data){
        chat.in(data.user.room).emit('colorChanged', data);
    });
});
