var util = require('../util/util.js');
var config = util.openJSON('./options.json');
var serverList = './servers.json';
var fs = require('fs');
var mysql = require('mysql');
var request = require('request');
var events = require('events');
var serverList = './servers.json';

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'B3$tP4$$',
    database: 'discordBot'
});

var currentStreams = [];
//105399615683092480
var options = config.Options;


// don't forget your soundcloud api key
var scKey = options.streamKey;

// server ids
var servers = [];


var serversJSON = util.openJSON(serverList);
for (var i = 0; i < serversJSON.servers.length; i++) {
    servers[servers.length] = serversJSON.servers[i].server;
}

exports.musicEvents = new events.EventEmitter();


exports.skip = function() {

}

exports.playNext = function(bot, servnum, sid) {
    try {
        exports.play(bot, servnum, sid);
    } catch (err) {
        console.log(err);
        console.log("no music");
    }
}

exports.playStop = function(bot, thisServer, sid) {
    if (bot.voiceConnections[thisServer]) {
        try {
            var songs;
            serverJSON = util.openJSON(serverList);
            connection.query('SELECT * FROM `?`', [sid.toString()], function(err, results, fields) {
                if (err) throw err;
                songs = results;
            });
            setTimeout(function() {
                bot.voiceConnections[thisServer].setVolume(serverJSON.servers[thisServer].volume);
                bot.voiceConnections[thisServer].stopPlaying();
                serverJSON.servers[thisServer].currentTime = 0;
                util.writeJSON(serverList, serverJSON);
                currentStreams[thisServer] = false;
                if (songs[0].song_type == "YouTube" && options.deleteSong == true) {
                    var songPath = ['./playlists/', sid, '/', songs[0].song_id, '.mp3'].join("");
                    var nodelete = false;
                    for (var i = 1; i < songs.length; i++) {
                        if (songs[i].song_id == songs[0].song_id) {
                            nodelete = true;
                            break;
                        }
                    }
                    if (!nodelete)
                        fs.unlinkSync(songPath);
                }
                connection.query('DELETE FROM `?` LIMIT 1', [sid.toString()], function(err) {
                    if (err) throw err;
                });
                songs.splice(0, 1);
                setTimeout(function() {
                    if (songs.length >= 1)
                        exports.playNext(bot, thisServer, sid);
                    songs = null;
                }, 100);
            }, 300);
        } catch (err) {
            console.log(err);
        }
    }
}

exports.play = function(bot, Vserver, sid) {
    var playlist;
    var serverJSON = util.openJSON(serverList);
    var VS = util.serverIndex(sid);
    connection.query('SELECT * FROM `?`', [sid.toString()], function(err, results, fields) {
        if (err) throw err;
        playlist = results;
    });

    setTimeout(function() {
        if (playlist != null) {
            try {
                if (playlist[0].song_type == "SoundCloud") {
                    currentStreams[Vserver] = request("http://api.soundcloud.com/tracks/" + playlist[0].song_id + "/stream?client_id=" + scKey);
                }
                if (playlist[0].song_type == "SoundCloud") {
                    if (serverJSON.servers[VS].paused == true || serverJSON.servers[VS].currentTime != 0) {
                        bot.voiceConnections[Vserver].playRawStream(currentStreams[Vserver], {
                            seek: serverJSON.servers[VS].currentTime,
                            volume: serverJSON.servers[VS].volume
                        });
                    }
                    if (serverJSON.servers[VS].paused == false && serverJSON.servers[VS].currentTime == 0) {
                        bot.voiceConnections[Vserver].playRawStream(currentStreams[Vserver], {
                            volume: serverJSON.servers[VS].volume
                        });
                    }
                } else if (playlist[0].song_type == "YouTube") {
                    if (serverJSON.servers[VS].paused == true || serverJSON.servers[VS].currentTime != 0) {
                        bot.voiceConnections[Vserver].playFile('./playlists/' + sid + '/' + playlist[0].song_id + '.mp3', {
                            seek: serverJSON.servers[VS].currentTime,
                            volume: serverJSON.servers[VS].volume
                        }, function(error, intent) {
                            intent.on("end", function() {
                                setTimeout(function() {
                                    exports.playStop(bot, Vserver, sid);
                                    exports.musicEvents.emit('songEnd');
                                }, 3000);
                            });
                        });
                    }
                    if (serverJSON.servers[VS].paused == false && serverJSON.servers[VS].currentTime == 0) {
                        bot.voiceConnections[Vserver].playFile('./playlists/' + sid + '/' + playlist[0].song_id + '.mp3', {
                            volume: serverJSON.servers[VS].volume
                        }, function(error, intent) {
                            intent.on("end", function() {
                                setTimeout(function() {
                                    exports.playStop(bot, Vserver, sid);
                                    exports.musicEvents.emit('songEnd');
                                }, 3000);
                            });
                        });
                    }
                }
                var dur = playlist[0].song_dur;
                bot.sendMessage(serverJSON.servers[VS].boundChannel, "**Now Playing:** **" + playlist[0].song_name + "** In: ", function(error, msg) {
                    if (error) {
                        console.log(error);
                    }
                    serverJSON.servers[VS].nowplaying = msg.id;
                    util.writeJSON(serverList, serverJSON);
                });
                if (serverJSON.servers[VS].paused == false && serverJSON.servers[VS].currentTime == 0) {
                    serverJSON.servers[VS].startTime = Math.floor(bot.uptime / 1000);
                }
                serverJSON.servers[VS].paused = false;
                exports.currentTime(bot, VS, Vserver);
                util.writeJSON(serverList, serverJSON);
            } catch (err) {
                console.log(err);
                console.log("What the fuck happened");
            }
            try {
                if (playlist[0].song_type == "SoundCloud") {
                    currentStreams[Vserver].on('end', function() {
                        setTimeout(function() {
                            exports.playStop(bot, Vserver, sid);
                            exports.musicEvents.emit("songEnd");
                        }, 16100);
                    });
                    currentStreams[Vserver].on('error', function(error) {
                        console.log(error);
                    });
                }
            } catch (err) {
                console.log(err);
            }
        }
    }, 1000);
}

exports.currentTime = function(bot, VS, S) {
    if (fs.existsSync(serverList)) {
        var pl = util.openJSON(serverList);
        var time = setInterval(function() {
            pl.servers[VS].currentTime = Math.floor(bot.uptime / 1000) - pl.servers[VS].startTime;
            util.writeJSON(serverList, pl);
        }, 2000);

        exports.musicEvents.on("songEnd", function (){
            clearInterval(time);
            return;
        });
        exports.musicEvents.on("pause", function () {
            clearInterval(time);
            return;
        });

    } else {
        return;
    }
}

exports.pause = function(bot, sid, Vserver) {
    var VS = util.serverIndex(sid);
    bot.voiceConnections[Vserver].stopPlaying();
    var playlist = util.openJSON(serverList);
    playlist.servers[VS].currentTime = Math.floor(bot.uptime / 1000) - playlist.servers[VS].startTime;
    playlist.servers[VS].timePaused = Math.floor(bot.uptime / 1000);
    playlist.servers[VS].paused = true;
    exports.musicEvents.emit("pause");
    util.writeJSON(serverList, playlist);
    playlist = null;
}
