// 命令を受ける
var shell = {
    get : function(data, model, func){
        new Cmd(data.message, data.user, model, func).run();
    },
    isCommand : function(text){
        return /^\//.test(text);
    }
};

// いろいろなコマンド
var Cmd = function(cmd, user, model, callback){
    this.parse(cmd);
    this.user     = user;
    this.model    = model;
    this.callback = callback;
};
(function(proto){
var bin = {
    help : {
        desc : "Show this help message",
        execute : function(){
            var results = new Array();
            for (var key in bin) {
                results.push('/' + key + ': ' + bin[key].desc);
            };
            this.callback(results.join('\n'), true);
        }
    },
    time : {
        desc : "Display current time",
        execute : function(){
            var t     = new Date(), s=' ', d=':',
                days  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 
                         'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                date  = null;
             date = days[t.getDay()]    +s+
                    month[t.getMonth()] +s+
                    t.getDate()         +s+
                    t.getFullYear()     +s+
                    t.getHours()        +d+
                    t.getMinutes()      +d+
                    t.getSeconds();
            this.callback(date, true);
        }
    },

    omikuji : {
        desc : "Cast you some Fortune Cookies",
        execute : function(){
            var result = ['大吉','中吉','小吉','吉','半吉','末吉',
                          '末小吉','凶','小凶','半凶','末凶','大凶'];
            this.callback(result[Math.round(Math.random()*11)], true);
        }
    },

    token : {
        desc : "Show your unique token",
        execute : function(){
            this.callback(this.user.token, true);
        }
    },

    member : {
        desc : "List of members in this room",
        execute : function(){
            var self = this;
            this.model.User.where('room').equals(this.user.room).exec(function(err, docs){
                self.callback(docs.map(function(d){return d.name}).join(', '), true);
            });
        }
    },

    search : {
        desc : "Search the log in the given word",
        execute : function(){
            var self   = this,
                regexp = this.argv.join('|');
            if(!!regexp){
                console.log(regexp);
                this.model.ChatLog
                    .find({room : this.user.room, text : new RegExp(regexp)})
                    .exec(function(err, docs){
                    self.callback(docs.map(function(d){
                        return d.name+': '+d.text
                    }).join('\n'), false);
                });
            } else {
                self.callback('Please enter the word...', false);
            }
        }
    }
};

var error = function(){
    this.callback('No command \''+this.cmd+'\' found');
};

proto.run = function(){
    !!bin[this.cmd] ? bin[this.cmd].execute.call(this) : error.call(this);
};

proto.parse = function(cmd){
    var cmds  = cmd.split(/\s+/);
    this.cmd  = cmds.shift().replace(/^\//,'');
    this.argv = (1 <= cmds.length) ? cmds : [];
}

})(Cmd.prototype);

module.exports = {shell : shell};
