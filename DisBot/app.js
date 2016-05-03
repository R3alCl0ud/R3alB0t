//include discord

var Discord = require("discord.js");
var opus = require('node-opus');
var request = require("request");
var url = require("url");
var fs = require('fs');

var bot = new Discord.Client({autoReconnect: true});

var config = require("./options.json");

var prefix = config.prefix;

var scKey = config.streamKey;

var boundChannels = [];
var currentStreams = [];

var dirs = [];

var Vserver = 0;
var Vservnum = 0;

var playlists = [];
//playlists[] = [];
var addedby = [];
var songtype = [];
var paused = false;
var timePaused = 0;
var pausedTime = 0;
var currentTime = 0;
var startTime = 0;
var nowplaying;

var volume = config.volume;

// Video that is currently being played
var currentVideo = false;

// Last video played
var lastVideo = false;

var i = 0;
var x = 0;
var d = "";


var admin = "";

var admins = fs.readFileSync('admins.txt').toString().split("\n");
for (i in admins) {
    if (i == 0) {
        admin = admin + "" + admins[i];
    } else {
        admin = admin + ", " + admins[i];
    }
}
console.log("Users in admins: " + admin);

// Get the email and password
var AuthDetails = require("./auth.json");


bot.loginWithToken(AuthDetails.token);

//when the bot is ready
bot.on("ready", function() {
    console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
    bot.setPlayingGame("");
    //console.log(bot.user.id);
});

//when the bot disconnects
bot.on("disconnected", function() {
    //alert the console
    console.log("Disconnected!");

    //exit node.js with an error
    process.exit(1);
});

//when the bot receives a message
bot.on("message", function(msg) {


    var dm = msg.channel.isPrivate;

    if (msg.content.startsWith("https://discord.gg/") && dm) {
        bot.joinServer(msg.content);
        console.log("joined a new server");

    }

    if (msg.content.startsWith("**Now Playing:**")) {
        nowplaying = msg;
    }



    if (!msg.content.startsWith(prefix)) return;
    var usr = msg.author;

    msg.content = msg.content.substr(prefix.length);



    if (msg.content.startsWith("admin")) {
        if (admins.indexOf(msg.author.id.toString()) != -1) {
            x = admins.legnth;
            admins[x] = msg.mentions[0].id;
            fs.appendFile("admins.txt", "\n" + admins[x]);
            msg.reply(" successfully added: " + msg.content.split(" ").slice(1).join(" "));
            console.log(msg.author.id.toString() + " successfully added: " + msg.mentions[0].id);
        } else {
            console.log(msg.author.toString() + " unsuccessfully tried to add: " + msg.mentions[0].id);
            msg.reply(" warning you tried to add: " + msg.content.split(" ").slice(1).join(" ") + " but don't have perms! do it again and an admin will be notified");
        }
    }

    if (msg.content == "help") {
        var fourchan = msg.channel;
        bot.sendMessage(fourchan, [
            "**~means it requires user to be on admin list~**",
            "Available commands are:",
            "`" + prefix + "help:` Displays the list of commands",
            "`" + prefix + "slap:` Hit a user with a random object",
            "`" + prefix + "soundcloud <link to song>:` adds a song from soundcloud to the music playlist",
            "`" + prefix + "skip:` skips current song",
            "`" + prefix + "pause:` stop playing music",
            "`" + prefix + "destroy:` leaves the voice channel",
            "`" + prefix + "join <voice channel>:` joins a voice channel",
            "`" + prefix + "play:` starts/resumes playing music",
            "`" + prefix + "volume:` changes the volume of the music (default volume defined in options.json)"
        ].join("\n"));

        console.log("The user " + msg.author.username.toString() + " used the help command");
    }


    if (msg.content == "stats") {
        msg.reply([
            "I am connected/have access to:",
            bot.servers.length + " servers",
            bot.channels.length + " channels",
            bot.users.length + " users",
        ].join("\n"));
        console.log("The user " + msg.author.username.toString() + " tried to use the stats command");
    }

    if (msg.content.startsWith("slap")) {
        var randNumMin = 0;
        var fish = ["clown fish", "sword fish", "shark", "sponge cake", "blue berry pie", "banana", "poptart", "the blunt of a sword", "websters dicitonary: hardcopy"];
        var randNumMax = fish.length();
        var pick = (Math.floor(Math.random() * (randNumMax - randNumMin + 1)) + randNumMin);
        bot.sendMessage(msg.channel, msg.content.split(" ").slice(1).join(" ") + " got slapped with a " + fish[pick] + " by " + msg.author.toString());
    }

    if (msg.content == "summon") {
        try {
            bot.joinVoiceChannel(msg.author.voiceChannel.id);
            boundChannels[Vservnum] = msg.channel;
            dirs[Vservnum] = ('./' + msg.channel.server.name);
            if (!fs.exsistsSync(dirs[Vservnum])) {
                fs.mkdirSync(dirs[Vservnum]);
            }
            Vservnum++;
            console.log(Vservnum);
        } catch (err) {
            msg.reply("You are not in a voice Channel");
        }
    }


    if (msg.content.startsWith("join")) {
        var channeltoJoin = msg.content.split(" ").slice(1).join(" ");
        var channels = msg.channel.server.channels;
        for (var channel of channels) {
            if (channel instanceof Discord.VoiceChannel) {
                if (!channeltoJoin || channel.name === channeltoJoin) {
                    bot.joinVoiceChannel(channel);
                    console.log("joined voice channel: " + channeltoJoin + " in server: " + msg.channel.server.toString());
                }
            }
        }
        boundChannels[Vservnum] = msg.channel;
        dirs[Vservnum] = ("./" + msg.channel.server.name);
        if (!fs.exsistsSync(dirs[Vservnum])) {
            fs.mkdirSync(dirs[Vservnum]);
        }
        Vservnum++;
        console.log(Vservnum);
        //bot.voiceConnection.setVolume(0.05);
    }

    if (msg.content == "destroy") {
        try {
            bot.voiceConnection.destroy();
        } catch (err) {
            msg.reply("noot! noot!");
        }
        bot.setPlayingGame("");
    }

    if (msg.content.startsWith("soundcloud")) {
        var body;
        var info;

        boundChannels[Vserver] = msg.channel;
        dirs[Vservnum] = ("./" + msg.channel.server.name);
        var newDir = dirs[Vserver];
        if (!fs.exsistsSync(newDir) {
            fs.mkdirSync(newDir[, 34]);
        }

        Vservnum++;
        console.log(Vservnum);

        try {
            request("http://api.soundcloud.com/resolve.json?url=" + msg.content.split(" ").slice(1).join(" ") + "&client_id=" + scKey, function(error, response, body) {

                body = JSON.parse(body);

                if (body.kind == "track") {
                    addedby.push(msg.author.username);
                    playlist.push(body);
                    console.log(body.title + " added by: " + msg.author.username);
                    bot.sendMessage(msg.channel, "Added 1 song to the queue!");
                }
                if (body.kind == "playlist") {
                    for (var i = 0; i < body.tracks.length; i++) {
                        var song = body.tracks[i];
                        playlists[Vserver].push(song);
                        songtype.push("soundcloud");
                        addedby.push(msg.author.username);
                        console.log(song.title + " added by: " + msg.author.username);
                    }
                    bot.sendMessage(msg.channel, "Added " + body.tracks.length + " songs to the queue!");
                }
            });
        } catch (err) {
            msg.reply("invalid link");
        }

    }

    if (msg.content.startsWith("youtube")) {
        var video = msg.content.split(" ").slice(1);

        bot.voiceConnection.playRawStream(request(video));
    }

    if (msg.content == "play") {
        playNext(bot);
        timePaused = (bot.uptime / 1000);
        try {
            bot.voiceConnection.setVolume(volume);
        } catch (err) {}
    }

    if (msg.content == "skip") {
        playlist.splice(0, 1);
        addedby.splice(0, 1);
        playNext(bot);
    }

    if (msg.content.startsWith("pause")) {
        bot.voiceConnection.stopPlaying();
        paused = true;
        pausedTime = bot.uptime / 1000;
        currentTime = (bot.uptime / 1000) - startTime;
    }

    if (msg.content.startsWith("volume")) {
        volume = (msg.content.split(" ").slice(1).join(" ") / 100);
        try {
            bot.voiceConnection.setVolume(volume);
            bot.sendMessage(msg.channel, "Volume set to: " + (volume * 100) + "%");
        } catch (err) {
            bot.sendMessage(msg.channel, "Put me in a voice channel first!");
        }
        console.log("The user " + msg.author.username.toString() + " used the volume command");
        console.log("Volume set to " + (volume * 100) + "%");
    }

    if (msg.content == "time") {
        try {
            Time = new Date();
            //var cTime = (Time.getSeconds() + Time.getMilliseconds()/1000) - startTime;
            bot.sendMessage(msg.channel, "current song time: " + cTime + "/" + (playlist[0].duration) / 1000);
        } catch (err) {
            msg.reply("no song playing");
        }

    }

});


function playNext(bot, servnum) {

    console.log("playlist length: " + playlist.length);
    try {
        play(bot, playlist[servnum][0]);
    } catch (err) {
        console.log("no music");
    }

}

function playStop(bot, thisServer) {
    if (bot.voiceConnection) {

        bot.voiceConnections[thisServer].setVolume(volume);
        bot.voiceConnections[thisServer].stopPlaying();
        currentVideo = false;
        playlists[thisServer].splice(0, 1);
        //addedby.splice(0, 1);
        playNext(bot, thisServer);
    }
}

function play(bot, info, Vserver) {
    var body = info;

    if (paused[Vserver] == true) {
        currentStreams[Vserver] = request("http://api.soundcloud.com/tracks/" + body.id + "/stream?consumer_key=" + scKey);
    } else {
        currentStreams[Vserver] = request("http://api.soundcloud.com/tracks/" + body.id + "/stream?consumer_key=" + scKey, function (error){

        });
    }
    try {
        if (paused[Vserver] == true) {
            bot.voiceConnection.playRawStream(currentStream, {
                seek: currentTime, volume: volume
            });
        }
        if (paused[Vserver] == false) {
            bot.voiceConnection.playRawStream(currentStream, {volume: volume});
        }
        bot.voiceConnection.setVolume(volume);
        console.log("Song: " + body.title + ", now playing");
        bot.sendMessage(boundChannels[Vserver], "**Now Playing:** **" + body.title + " Requested by: " + addedby[0] + "**");

        try {
            bot.deleteMessage(nowplaying);
        } catch (err) {
            console.log("no message to delete");
        }


        if (paused == false) {
            startTimes[] = (bot.uptime / 1000);
        } else {
            startTimes[] += timePaused;
            paused = false;
        }

    } catch (err) {
        //bot.reply(msg, "Put me in a voice channel first.");
        console.log("What the fuck happened");
    }
    currentStream.on('end', function() {
        setTimeout(function() {
            playStop(bot, Servnum);
        }, 16100);
        currentTimes[] = 0;
        bot.setPlayingGame("");

    });
    currentStream.on('error', function() {
        bot.sendMessage(boundChannels[msgChannel], "umm not sure what happened");
    });
}
