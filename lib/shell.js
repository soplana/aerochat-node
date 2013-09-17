var async = require('async');
//var model = require('../model/user.js');
//console.log("----------------------------------------------");
//console.log(model.User.findOne());
//console.log("----------------------------------------------");

// 命令を受ける
var shell = {
    get : function(data, model){
        return new Cmd(data.message, data.user, model).run();
    },
    isCommand : function(text){
        return /^\//.test(text);
    }
};

// いろいろなコマンド
var Cmd = function(cmd, user, model){
    this.cmd  = cmd.replace(/^\//,'');
    this.user = user;
    this.model = model
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

    members : {
        desc : "Display current users in this chat.",
        execute : function() { // **
          var that = this;
          var hoge = '';
          async.waterfall([
              function(callback) {
                var query = that.model.User.find({room: that.user.room});
                query.exec(function(err, results) {
                  callback(null, results);
                });
              }
          ], function(err, waterfallResults) {
            hoge = waterfallResults.map(function(user) { return user.name; }).join('\n');
            console.log("in waterfall -- 1111111111111111111111111");
            console.log(hoge) // => user1 user2 user3...
            return hoge; // としてもexecuteに入れたfunctionの返り値にはならない
          });
          console.log("22222222222222222222222"); // 2222..が111...よりも先にprintされる.
          console.log(hoge); // => "" まだhogeが変更されていない時点でここに来る.

          setTimeout(function() { // 2秒待ってからhogeを出力してみる.
            console.log("33333333333333333333333"); // 222, "", 111, user.., の次に333, user..がprint
            console.log(hoge); // => user1 user2 user3...
            return hoge; // でもやはりここもfunction内であり, executeに対し文字列をreturnできない
          }, 2000);
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
