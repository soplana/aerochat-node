// DB
var mongo = require('mongoose');

mongo.connect('mongodb://localhost/aerochat_dev');
var Schema = mongo.Schema, ObjectId = Schema.ObjectId;




/****************************
 * User model
 ***************************/
var UserSchema = new Schema({
    _id   : ObjectId,
    name  : String,
    room  : String,
    token : String,
    key   : String,
    uploader : {type: Boolean, default: false} 
});
var User = mongo.model('User', UserSchema);
(function(proto){
    proto.attributes = function(data){
        this.name  = data.user.name;
        this.token = data.user.token;
        this.room  = data.room;
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
    date  : { type: Date, default: Date.now }
});
var ChatLog = mongo.model('ChatLog', ChatLogSchema);
(function(proto){
    proto.attributes = function(data){
        this.name  = data.user.name;
        this.token = data.user.token;
        this.room  = data.room;
        this.text  = data.message;
    };
})(ChatLog.prototype);

module.exports = {ChatLog : ChatLog, User : User};
