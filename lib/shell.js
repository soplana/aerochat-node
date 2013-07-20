// 命令を受ける
var shell = {
    get : function(data){
        return new Cmd(data.message, data.user).run();
    },
    isCommand : function(text){
        return /^\//.test(text);
    }
};

// いろいろなコマンド
var Cmd = function(cmd, user){
    this.cmd  = cmd.replace(/^\//,'');
    this.user = user
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
            return results.join('\n');
        }
    },
    time : {
        desc : "Display current time",
        execute : function(){
            var t     = new Date(), s=' ', d=':',
                days  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 
                         'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return  days[t.getDay()]    +s+
                    month[t.getMonth()] +s+
                    t.getDate()         +s+
                    t.getFullYear()     +s+
                    t.getHours()        +d+
                    t.getMinutes()      +d+
                    t.getSeconds();
        }
    },

    omikuji : {
        desc : "Cast you some Fortune Cookies",
        execute : function(){
            var result = ['大吉','中吉','小吉','吉','半吉','末吉',
                          '末小吉','凶','小凶','半凶','末凶','大凶'];
            return result[Math.round(Math.random()*11)];
        }
    },

    token : {
        desc : "Show your unique token",
        execute : function(){
            return this.user.token;
        }
    }
};

var error = function(){
    return 'No command \''+this.cmd+'\' found';
};

proto.run = function(){
    return !!bin[this.cmd] ? bin[this.cmd].execute.call(this) : error.call(this);
};

})(Cmd.prototype);

module.exports = {shell : shell};
