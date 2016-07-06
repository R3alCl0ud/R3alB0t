var util = require("../util/util");
var fs = require('fs');
var scdl = require('../util/soundcloud');
var yt = require('../util/youtube');
var config = require("../../options.json");
var mysql = require('mysql');
var music = require("../voice/music");
var options = config.Options;

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'B3$tP4$$',
    database: 'discordBot'
});

// command prefix
var prefix = options.prefix;
// don't forget your soundcloud api key
var scKey = options.streamKey;

var start = function () {
    console.log("starting chat handler");
    return "chat";
}




var help = function(bot, msg, usr) {
    var channel = msg.channel;
    bot.sendMessage(channel, [
        "**~means it requires user to be on admin list~**",
        "Available commands are:",
        "`" + prefix + "destroy:` leaves the voice channel",
        "`" + prefix + "help:` Displays the list of commands",
        "`" + prefix + "np:` Displays the currently playing song",
        "`" + prefix + "pause:` stop playing music",
        "`" + prefix + "play:` starts/resumes playing music",
        "`" + prefix + "queue:` Shows the playlist queue for the server",
        "`" + prefix + "request <link to song>:` adds a song from soundcloud or youtube to the music playlist",
        "`" + prefix + "shuffle:` Shuffles the playlist of songs for this server",
        "`" + prefix + "skip:` skips current song (allow once every 12 seconds)",
        "`" + prefix + "slap:` Hit a user with a random object",
        "`" + prefix + "summon:` joins the voice channel you are in on the server",
        "`" + prefix + "volume:` changes the volume of the music (default volume defined in options.json)"
    ].join("\n"));
}

var slap = function(bot, msg, usr) {
    console.log(msg.mentions);
    var randNumMin = 0;
    var fish = ["clown fish", "sword fish", "shark", "sponge cake", "blue berry pie", "banana", "poptart", "the blunt of a sword", "websters dicitonary: hardcopy"];
    var randNumMax = fish.length - 1;
    var pick = (Math.floor(Math.random() * (randNumMax - randNumMin + 1)) + randNumMin);
    bot.sendMessage(msg.channel, msg.mentions[0] + " got slapped with a " + fish[pick] + " by " + usr.toString());
}

var stats = function(bot, msg, usr) {
    msg.reply([
        "I am connected/have access to:",
        bot.servers.length + " servers",
        bot.channels.length + " channels",
        bot.users.length + " users",
    ].join("\n"));
}

var summon = function(bot, msg, usr) {
    var usr = msg.author;
    var msrv = msg.channel.server;
    var dm = msg.channel.isPrivate;
    var chnl = msg.channel;

    if (usr.voiceChannel.server.id == msrv.id) {
        var base = {
            "server": msrv.id,
            "serverName": msrv.name,
            "voiceName": usr.voiceChannel.name,
            "boundChannel": msg.channel.id,
            "voiceChannel": usr.voiceChannel.id,
            "volume": options.volume,
            "paused": false,
            "timePaused": 0,
            "startTime": 0,
            "nowplaying": "",
            "currentTime": 0
        };
        bot.joinVoiceChannel(usr.voiceChannel.id);
        var n = util.serverIndex(msrv.id);
        console.log(n);
        serversJSON = util.openJSON("./servers.json");
        if (n == -1) {
            serversJSON.servers[serversJSON.servers.length] = base;
            util.writeJSON(serverList, serversJSON);
        }

        if (!fs.existsSync('./playlists/' + msrv.id)) {
            fs.mkdirSync('./playlists/' + msrv.id);
        }
        console.log("joined voice channel: " + usr.voiceChannel.name + " in server: " + msrv.toString());
        base = null;
        serversJSON = null;

    } else {
        msg.reply("You are not in a voice channel on this server");
    }
}

var request = function(bot, msg, usr) {
    var msrv = msg.channel.server;
    var chnl = msg.channel;
    var songLinkUrl = msg.content.split(" ").slice(1).join(" ");

    songLinkUrl = songLinkUrl.replace("http://", "https://");
    if (songLinkUrl.startsWith("https://soundcloud.com/")) {
        scdl.handleSClink(songLinkUrl, msrv.id, usr, scKey);
    } else if (songLinkUrl.startsWith("https://www.youtube.com/playlist?")) {
        var newplaylist = {
            "url": songLinkUrl,
            "usr": usr.username,
            "id": msg.channel.server.id
        };
        var spot = yt.ytPlaylist(newplaylist);
        newplaylist = null;
        if (spot > 1) {
            bot.sendMessage(chnl, "Already downloading a playlist\nYou are in slot: " + spot + " of the queue", function(error, message) {
                bot.deleteMessage(message, {
                    wait: 5000
                });
            });
        } else {
            bot.sendMessage(chnl, "Downloading Playlist...", function(error, message) {
                bot.deleteMessage(message, {
                    wait: 5000
                });
            });
        }
    } else if (songLinkUrl.startsWith("https://www.youtube.com/")) {
        yt.handleYTlink(songLinkUrl, msrv.id, usr);
        setTimeout(function() {
            bot.sendMessage(chnl, "The song has been added to the playlist", function(error, message) {
                bot.deleteMessage(message, {
                    wait: 7000
                });
            }, 700);
        });
    }
}

var play = function (bot, msg, usr) {

    msrv = msg.channel.server;

    if (serverNum(bot, msrv.id) != -1) {
        Vserver = serverNum(bot, msrv.id);
        music.playNext(bot, Vserver, msrv.id);
    } else {
        msg.reply(["I am not in a voice channel on this server",
            "Put me in a voice channel if you want to play music"
        ].join("\n"));
    }
}

function serverNum(bot, gid) {
    for (var voice in bot.voiceConnections)
    {
        if (bot.voiceConnections[voice].server.id == gid)
        {
            return voice;
        }
    }
    return -1;
}

module.exports = {
    help: help,
    slap: slap,
    stats: stats,
    summon: summon,
    request: request,
    play: play,
    start: start
};

connection.query('SELECT * FROM `cmd`', function(err, results, fields) {
    if (err) throw err;
    console.log(results);
    for (cmd in results) {
        module.exports[cmd.title] = function (bot, msg, usr) {
            if (msg.channel.server.id == cmd.guild_id)
            bot.sendMessage(msg.channel, cmd.message);
        }
    }
});
