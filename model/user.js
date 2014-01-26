// DB
var mongo = require('mongoose');

mongo.connect('mongodb://localhost/aerochat_dev');
var Schema = mongo.Schema, ObjectId = Schema.ObjectId;



/****************************
 * Tool model
 ***************************/
var ToolSchema = new Schema({
    _id   : ObjectId,
    color : {type: String, default: 'rgb(54,55,56)'},
    size  : {type: String, default: '1'}
});


/****************************
 * User model
 ***************************/
var UserSchema = new Schema({
    _id   : ObjectId,
    name  : String,
    room  : String,
    token : String,
    key   : String,
    tools : [ToolSchema],
    uploader : {type: Boolean, default: false} 
});
var User = mongo.model('User', UserSchema);
(function(proto){
    proto.attributes = function(data){
        this.name  = data.user.name;
        this.token = data.user.token;
        this.room  = data.room;
        var tool   = !!data.tool ? data.tool : {};
        this.tools.push(tool);
    };

    proto.setUploader = function(){
        this.uploader = true
    };
})(User.prototype);


/****************************
 * ChatLog model
 ***************************/
var ChatLogSchema = new Schema({
    _id   : ObjectId,
    name  : String,
    room  : String,
    token : String,
    key   : String,
    text  : String,
    message_type : String,
    date  : { type: Date, default: Date.now }
});
var ChatLog = mongo.model('ChatLog', ChatLogSchema);
(function(proto){
    proto.attributes = function(data){
        this.name  = data.user.name;
        this.token = data.user.token;
        this.room  = data.room;
        this.text  = data.message;
        this.message_type = data.message_type;
    };
})(ChatLog.prototype);

module.exports = {
    ChatLog : ChatLog, 
    User    : User
};
