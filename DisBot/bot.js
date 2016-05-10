//include discord

var Discord = require("discord.js");
var opus = require('node-opus');
var request = require("request");
var url = require("url");
var fs = require('fs');
var ytdl = require('youtube-dl');
var path = require('path');
var pl = require('./util/playlist');
var scdl = require('./util/soundcloud');
var yt = require('./util/youtube');
var util = require('./util/util');


var bot = new Discord.Client({
    autoReconnect: true
});

// grab all of those options
var config = require("./options.json");

var options = config.Options;

// command prefix
var prefix = options.prefix;

// don't forget your soundcloud api key
var scKey = options.streamKey;

// Get the email and password
var AuthDetails = config.Auth;

// all of my variable arrays for multi voice music playing
var servers = [];
var currentStreams = [];
var playListFiles = []; // each servers playlist json file
var Vserver = 0;
var Vservnum = 0;
var downloadingPL = false;
var queuedPLs = [];

var skipping = [];

var admin = "";

var admins = fs.readFileSync('admins.txt').toString().split("\n");
for (var i in admins) {
    if (i == 0) {
        admin = admin + "" + admins[i];
    }
    else {
        admin = admin + ", " + admins[i];
    }
}
console.log("Users in admins: " + admin);


bot.loginWithToken(AuthDetails.token);

//when the bot is ready
bot.on("ready", function() {
    console.log("Ready to begin! Serving in " + bot.channels.length + " channels");

    var folders = fs.readdirSync('./playlists/');
    if (folders.length > 0)
        bot.setPlayingGame("Beginning Auto Recover");
    for (var pl in folders) {
        var info = fs.statSync('./playlists/' + folders[pl]);
        if (info.isDirectory() == true) {
            var playlist = util.openJSON('./playlists/' + folders[pl] + '/' + folders[pl] + '.json');
            currentStreams[Vservnum] = false;
            servers[Vservnum] = playlist.server;
            bot.joinVoiceChannel(playlist.voiceChannel);
            playListFiles[Vservnum] = ("./playlists/" + folders[pl] + "/" + folders[pl] + ".json").toString();
            skipping[Vservnum] = false;
            console.log(servers);
            if (!playlist.paused){
                setTimeout(function () {
                    playNext(bot, Vservnum);
                    console.log("Connected to: " + Vservnum + " channels");
                    console.log("Rejoined voice on server: " + playlist.server);
                    playlist = null;
                }, 750);
            }
            setTimeout(function () {
                Vservnum++;
            }, 500);
        }
    }
    setTimeout(function () {
        bot.setPlayingGame("http://r3alb0t.xyz");
    }, 3000);
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

    var usr = msg.author;
    var msrv = msg.channel.server;
    var dm = msg.channel.isPrivate;
    var chnl = msg.channel;
    msrv.name = msrv.name.split(" ").join("");

    if (!msg.content.startsWith(prefix)) return;

    msg.content = msg.content.substr(prefix.length);

    if (msg.content.toLowerCase().startsWith("admin")) {
        if (admins.indexOf(msg.author.id.toString()) != -1) {
            var x = admins.legnth;
            admins[x] = msg.mentions[0].id;
            fs.appendFile("admins.txt", "\n" + admins[x]);
            msg.reply(" successfully added: " + msg.mentions[0]);
            console.log(msg.author.id.toString() + " successfully added: " + msg.mentions[0].id);
        }
        else {
            console.log(msg.author.toString() + " unsuccessfully tried to add: " + msg.mentions[0].id);
            msg.reply(" warning you tried to add: " + msg.mentions[0] + " but don't have perms! do it again and an admin will be notified");
        }
    }

    if (msg.content.toLowerCase() == "help") {
        var fourchan = msg.channel;
        bot.sendMessage(fourchan, [
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

        console.log("The user " + usr.toString() + " used the help command");
    }


    if (msg.content.toLowerCase() == "stats" && !dm) {
        msg.reply([
            "I am connected/have access to:",
            bot.servers.length + " servers",
            bot.channels.length + " channels",
            bot.users.length + " users",
        ].join("\n"));
        console.log("The user " + usr.username.toString() + " tried to use the stats command");
    }

    if (msg.content.toLowerCase().startsWith("slap") && !dm) {
        var randNumMin = 0;
        var fish = ["clown fish", "sword fish", "shark", "sponge cake", "blue berry pie", "banana", "poptart", "the blunt of a sword", "websters dicitonary: hardcopy"];
        var randNumMax = fish.length;
        var pick = (Math.floor(Math.random() * (randNumMax - randNumMin + 1)) + randNumMin);
        bot.sendMessage(msg.channel, msg.mentions[0] + " got slapped with a " + fish[pick] + " by " + usr.toString());
    }

    if (msg.content.toLowerCase().startsWith("playing") && dm) {
        console.log(msg.author.id);
        if (msg.author.id == "100748674849579008" || msg.author.id == "104063667351322624") {
            bot.setPlayingGame(msg.content.split(" ").slice(1).join(" "));
        }
    }

    if (msg.content.toLowerCase() == "summon" && !dm) {
        try {
            if (servers.indexOf(msrv.name) == -1) {
                if (usr.voiceChannel.server.name.split(" ").join("") == msrv.name) {
                    var base = {
                        "server": msrv.name.toString(),
                        "boundChannel": msg.channel.id,
                        "voiceChannel": usr.voiceChannel.id,
                        "volume": options.volume,
                        "paused": false,
                        "timePaused": 0,
                        "startTime": 0,
                        "nowplaying": "",
                        "currentTime": 0,
                        "tracks": []
                    };
                    bot.joinVoiceChannel(usr.voiceChannel.id);
                    servers[Vservnum] = msrv.name;
                    skipping[Vservnum] = false;

                    if (!fs.existsSync('./playlists/' + msrv.name)) {
                        fs.mkdirSync('./playlists/' + msrv.name);
                    }
                    playListFiles[Vservnum] = ('./playlists/' + msrv.name + "/" + msrv.name + ".json").toString();
                    if (!fs.existsSync(playListFiles[Vservnum])) {
                        util.writeJSON(playListFiles[Vservnum].toString(), base);
                    }
                    console.log("joined voice channel: " + usr.voiceChannel.name + " in server: " + msrv.toString());
                    currentStreams[Vservnum] = false;
                    Vservnum++;
                    base = null;
                    console.log("I am connected to " + Vservnum + " voice channel(s)");

                }
                else {
                    msg.reply("You are not in a voice channel on this server");
                }
            }
            else {
                msg.reply("I am already in a voice channel on this server");
            }
        }
        catch (err) {
            console.log(err);
            msg.reply("You are not in a voice Channel");
        }
    }



    if (msg.content.toLowerCase() == "destroy" && !dm) {
        try {
            if (servers.indexOf(msrv.name) != -1) {
                var i = servers.indexOf(msrv.name);
                var playlist = util.openJSON(playListFiles[i].toString());
                var songs = fs.readdirSync('./playlists/' + msrv.name.toString());
                for (var song in songs) {
                    fs.unlinkSync('./playlists/' + playlist.server.toString() + '/' + songs[song].toString());
                }

                if (fs.existsSync('./playlists/' + playlist.server.toString())) {
                    fs.rmdirSync('./playlists/' + playlist.server.toString());
                }

                playListFiles.splice(i, 1);
                servers.splice(i, 1);
                currentStreams.splice(i, 1);
                bot.voiceConnections[i].destroy();
                playlist = null;
                Vservnum--;
                console.log("I am connected to " + Vservnum + " voice channel(s)");
            }
        }
        catch (err) {
            console.log(err);
            msg.reply("well... this is akward. destroy is broken...");
        }
    }

    if (msg.content.toLowerCase().startsWith("request") && !dm) {

        var songLinkUrl = msg.content.split(" ").slice(1).join(" ");

        songLinkUrl = songLinkUrl.replace("http://", "https://");

        if (servers.indexOf(msrv.name) != -1) {
            Vserver = servers.indexOf(msrv.name);
            if (songLinkUrl.startsWith("https://soundcloud.com/")) {
                scdl.handleSClink(songLinkUrl, playListFiles[Vserver], usr, scKey);
            }
            else if (songLinkUrl.startsWith("https://www.youtube.com/playlist?")) {
                var newplaylist = {
                    "url": songLinkUrl,
                    "usr": usr.username,
                    "plF": playListFiles[Vserver],
                    "num": Vserver
                };
                var spot = yt.ytPlaylist(newplaylist);
                newplaylist = null;
                if (spot > 1) {
                    bot.sendMessage(chnl, "Already downloading a playlist\nYou are in slot: " + spot + " of the queue", function(error, message) {
                        bot.deleteMessage(message, {
                            wait: 5000
                        });
                    });
                }
                else {
                    bot.sendMessage(chnl, "Downloading Playlist...", function(error, message) {
                        bot.deleteMessage(message, {
                            wait: 5000
                        });
                    });
                }
            }
            else if (songLinkUrl.startsWith("https://www.youtube.com/")) {
                yt.handleYTlink(songLinkUrl, playListFiles[Vserver], usr, servers[Vserver].name);
                setTimeout(function() {
                    bot.sendMessage(chnl, "The song has been added to the playlist", function(error, message) {
                        bot.deleteMessage(message, {
                            wait: 7000
                        });
                    }, 700);
                });
            }
        }

        else if (Vserver == (servers.length - 1) && servers[Vserver].name != msrv.name) {
            msg.reply(["I am not in a voice channel on this server",
                "Put me in a voice channel if you want to play music"
            ].join("\n"));
        }
    }

    if (msg.content.toLowerCase() == "play" && !dm) {
        if (servers.indexOf(msrv.name) != -1) {
            Vserver = servers.indexOf(msrv.name)

            var playlist = util.openJSON(playListFiles[Vserver]);

            if (playlist.paused == true) {
                playlist.startTime += (Math.floor(bot.uptime / 1000) - playlist.timePaused);
            }
            playNext(bot, Vserver);


            try {
                bot.voiceConnections[Vserver].setVolume(playlist.volume);
            }
            catch (err) {

            }
            util.writeJSON(playListFiles[Vserver], playlist);
            playlist = null;
        }
        else {
            msg.reply(["I am not in a voice channel on this server",
                "Put me in a voice channel if you want to play music"
            ].join("\n"));
        }

    }

    if (msg.content.toLowerCase() == "skip" && !dm) {
        if (servers.indexOf(msrv.name) != -1) {
            Vserver = servers.indexOf(msrv.name);
            if (!skipping[Vserver]) {
                try {
                    skipping[Vserver] = true;
                    playStop(bot, Vserver);
                    /*setTimeout(function() {
                        skipping[Vserver] = false;
                    }, 12000);*/
                }
                catch (err) {
                    console.log(err);
                    console.log("no message to delete");
                }
            }
            else {
                bot.sendMessage(chnl, "Woah there padner'. This song just started. atleast give this one a chance.");
            }
        }
    }


    if (msg.content.startsWith("pause") && !dm) {
        if (servers.indexOf(msrv.name) != -1) {
            Vserver = servers.indexOf(msrv.name);
            bot.voiceConnections[Vserver].stopPlaying();
            var playlist = util.openJSON(playListFiles[Vserver]);
            playlist.currentTime = Math.floor(bot.uptime / 1000) - playlist.startTime;
            playlist.timePaused = Math.floor(bot.uptime / 1000);
            playlist.paused = true;
            util.writeJSON(playListFiles[Vserver], playlist);
            playlist = null;
        }
    }

    if (msg.content.toLowerCase().startsWith("volume") && !dm) {
        if (msg.content.split(" ").slice(1).join(" ").toUpperCase() == "EAR RAPE") {
            var volume = Math.pow(10, 100);
            if (servers.indexOf(msrv.name) != -1) {
                Vserver = servers.indexOf(msrv.name);
                var playlist = util.openJSON(playListFiles[Vserver]);
                try {
                    bot.voiceConnections[Vserver].setVolume(volume);
                    bot.sendMessage(playlist.boundChannel, "Volume set to: EAR RAPE");
                }
                catch (err) {
                    bot.sendMessage(playlist.boundChannel, "Put me in a voice channel first!");
                }
                playlist.volume = volume;
                util.writeJSON(playListFiles[Vserver], playlist);
                playlist = null;
                console.log("The user " + usr.toString() + " used the volume command");
                console.log("Volume set to " + (volume * 100) + "%");
            }
        }
        else {
            var volume = (msg.content.split(" ").slice(1).join(" ") / 100);
            if (Math.abs(volume) <= 2) {
                if (servers.indexOf(msrv.name) != -1) {
                    Vserver = servers.indexOf(msrv.name);
                    var playlist = util.openJSON(playListFiles[Vserver]);
                    try {
                        bot.voiceConnections[Vserver].setVolume(volume);
                        bot.sendMessage(playlist.boundChannel, "Volume set to: " + (volume * 100) + "%");
                    }
                    catch (err) {
                        bot.sendMessage(msg.channel, msg.author + ", Put me in a voice channel first!");
                    }
                    playlist.volume = volume;
                    util.writeJSON(playListFiles[Vserver], playlist);
                    playlist = null;
                    console.log("The user " + usr.toString() + " used the volume command");
                    console.log("Volume set to " + (volume * 100) + "%");
                }
                else {
                    bot.sendMessage(msg.channel, msg.author + ", Put me in a voice channel first!");
                }
            }
            else {
                bot.sendMessage(msg.channel, msg.author + ", Please Use a Reasonable Volume")
            }
        }
    }

    if (msg.content.toLowerCase() == "shuffle") {
        if (servers.indexOf(msrv.name) != -1) {
            var i = servers.indexOf(msrv.name);
            shuffle(playListFiles[i]);
        }
    }
    if (msg.content.toLowerCase() == "queue") {
        if (servers.indexOf(msrv.name) != -1) {
            var i = servers.indexOf(msrv.name);
            queueMsg(playListFiles[i], msg.channel);
        }
    }
    if (msg.content.toLowerCase() == "nowplaying" || msg.content.toLowerCase() == "np") {
        if (servers.indexOf(msrv.name) != -1) {
            var i = servers.indexOf(msrv.name);
            var songs = util.openJSON(playListFiles[i]);
            try {
                bot.sendMessage(msg.channel, "**Now Playing**:  `" + songs.tracks[0].title.toString() + "`\n**Submitted by:** <@" + songs.tracks[0].user.toString() + ">")
            }
            catch (err) {
                console.log(err);
                bot.sendMessage(msg.channel, "put me in a voice channel and que some songs first")
            };
            songs = null;
        }
        else {
            bot.sendMessage(msg.channel, msg.author + ", Put me in a voice channel first")
        }
    }

});


function playNext(bot, servnum) {

    try {
        play(bot, servnum);
    }
    catch (err) {
        console.log(err);
        console.log("no music");
    }
}

function playStop(bot, thisServer) {
    if (bot.voiceConnections[thisServer]) {
        try {
            var songs = util.openJSON(playListFiles[thisServer]);
            bot.voiceConnections[thisServer].setVolume(songs.volume);
            bot.voiceConnections[thisServer].stopPlaying();
            currentStreams[thisServer].destroy();
            //console.log(currentStreams[thisServer]);
            currentStreams[thisServer].on('error', function(error) {
                console.log(error);
            });
            currentStreams[thisServer] = false;
            if (songs.tracks[0].type == "youtube" && options.deleteSong == true) {
                var songPath = ['./playlists/', songs.server, '/', songs.tracks[0].id, '.mp3'].join("");
                var nodelete = false;
                for (var i = 1; i < songs.tracks.length; i++) {
                    if (songs.tracks[i].id == songs.tracks[0].id) {
                        nodelete = true;
                        break;
                    }
                }
                if (!nodelete)
                    fs.unlinkSync(songPath);
            }
            songs.tracks.splice(0, 1);
            util.writeJSON(playListFiles[thisServer], songs);
            setTimeout(function() {
                if (songs.tracks.length >= 1)
                    playNext(bot, thisServer);
                songs = null;
            }, 100);
        }
        catch (err) {
            console.log(err);
        }
    }
}

function play(bot, Vserver) {
        
    var playlist = util.openJSON(playListFiles[Vserver]);
    console.log("playing music in server: " + (Vserver + 1) + " name: " + playlist.server);

    if (playlist.tracks[0].type == "soundcloud") {
        currentStreams[Vserver] = request("http://api.soundcloud.com/tracks/" + playlist.tracks[0].id + "/stream?client_id=" + scKey);
    }
    else if (playlist.tracks[0].type == "youtube") {
        currentStreams[Vserver] = fs.createReadStream(('./playlists/' + playlist.server + '/' + playlist.tracks[0].id + '.mp3'));
    }
    try {
        if (playlist.tracks[0].type == "soundcloud") {
            if (playlist.paused == true) {
                bot.voiceConnections[Vserver].playRawStream(currentStreams[Vserver], {
                    seek: playlist.currentTime,
                    volume: playlist.volume
                });
            }
            if (playlist.paused == false) {
                bot.voiceConnections[Vserver].playRawStream(currentStreams[Vserver], {
                    volume: playlist.volume
                });
            }
        }
        else if (playlist.tracks[0].type == "youtube") {
            if (playlist.paused == true) {
                bot.voiceConnections[Vserver].playRawStream(currentStreams[Vserver], {
                    seek: playlist.currentTime,
                    volume: playlist.volume
                });
            }
            if (playlist.paused == false) {
                bot.voiceConnections[Vserver].playRawStream(currentStreams[Vserver], {
                    volume: playlist.volume
                });
            }
        }
        bot.voiceConnections[Vserver].setVolume(playlist.volume);
        var dur = playlist.tracks[0].duration;
        bot.sendMessage(playlist.boundChannel, "**Now Playing:** **" + playlist.tracks[0].title + "** In: " + playlist.server, function(error, msg) {
            if (error) {
                console.log(error);
            }
            bot.deleteMessage(msg, {
                wait: dur
            });
            playlist.nowplaying = msg.id;
        });

        if (playlist.paused == false) {
            playlist.startTime = Math.floor(bot.uptime / 1000);
        }
        playlist.paused = false;
        util.writeJSON(playListFiles[Vserver], playlist);
        playlist = null;
        skipping[Vserver] = true;
        setTimeout(function() {
            skipping[Vserver] = false;
        }, 12000);
    }
    catch (err) {
        console.log(err);
        console.log("What the fuck happened");
    }
    try {
        currentStreams[Vserver].on('end', function() {
            setTimeout(function() {
                playStop(bot, Vserver);
            }, 16100);
        });

        currentStreams[Vserver].on('error', function(error) {
            console.log(error);
        });
    }
    catch (err) {
        console.log(err);
    }
}

function shuffle(plF) {
    var playlist = util.openJSON(plF);
    var tracks = playlist.tracks;
    var channel = playlist.boundChannel.toString();

    //console.log(channel);
    for (var i = tracks.length - 1; i > 1; i--) {
        var n = Math.floor(Math.random() * (i + 1));
        if (n != 0) {
            var temp = tracks[i];
            tracks[i] = tracks[n];
            tracks[n] = temp;
        }
        else {
            i++;
        }
    }
    bot.sendMessage(channel, "**Shuffle :diamonds: Shuffle :spades: Shuffle :hearts:**", function(error, message) {
        if (error) {
            console.log(error);
        }
        bot.deleteMessage(message, {
            wait: 7000
        }, function(error) {
            if (error) {
                console.log(error);
            }
        });
    });
    playlist.tracks = tracks;

    util.writeJSON(plF, playlist);
    setTimeout(function() {
        playlist = null;
    }, 200);
}

function queueMsg(playlistFile, channel) {
    var queue = ["Current Playlist:", "", ""];
    try {
        var songs = util.openJSON(playlistFile);

        var queueWord = queue;
        var n = 0;

        if (songs.tracks.length > 20) {
            n = 20;
        }
        else {
            n = songs.tracks.length;
        }


        for (var i = 0; i < n; i++) {
            if ((queueWord + "**" + (i + 1) + "**:  `" + songs.tracks[i].title.toString() + "`, <@" + songs.tracks[i].user.toString() + ">").length <= 2000 && i < songs.tracks.length) {
                queue.push(("**" + (i + 1) + "**:  `" + songs.tracks[i].title.toString() + "`, <@" + songs.tracks[i].user.toString() + ">"));
                queueWord = queue;
            }
            else {
                break;
            }
        }
        queue.push("");
        queue.push("");
        queue.push("Playlist total length: " + songs.tracks.length);
        queueWord = queue;
        bot.startTyping(channel);
        setTimeout(function (){
            bot.stopTyping(channel);
            bot.sendMessage(channel, queueWord, function(error, message) {
                bot.deleteMessage(message, {
                    wait: 7000
                });
            });
        }, 750);
        songs = null;
    }
    catch (err) {

    }
}