//include discord

var Discord = require("discord.js");
var opus = require('node-opus');
var request = require("request");
var url = require("url");
var fs = require('fs');
var ytdl = require('youtube-dl');
var path = require('path');

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
    bot.setPlayingGame("with WIP Youtube Support");
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


    if (!msg.content.startsWith(prefix)) return;

    msg.content = msg.content.substr(prefix.length);



    if (msg.content.startsWith("admin")) {
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

    if (msg.content == "help") {
        var fourchan = msg.channel;
        bot.sendMessage(fourchan, [
            "**~means it requires user to be on admin list~**",
            "Available commands are:",
            "`" + prefix + "destroy:` leaves the voice channel",
            "`" + prefix + "help:` Displays the list of commands",
            "`" + prefix + "pause:` stop playing music",
            "`" + prefix + "play:` starts/resumes playing music",
            "`" + prefix + "queue:` Shows the playlist queue for the server",
            "`" + prefix + "request <link to song>:` adds a song from soundcloud or youtube to the music playlist",
            "`" + prefix + "shuffle:` Shuffles the playlist of songs for this server",
            "`" + prefix + "skip:` skips current song",
            "`" + prefix + "slap:` Hit a user with a random object",
            "`" + prefix + "summon:` joins the voice channel you are in on the server",
            "`" + prefix + "volume:` changes the volume of the music (default volume defined in options.json)"
        ].join("\n"));

        console.log("The user " + usr.toString() + " used the help command");
    }


    if (msg.content == "stats" && !dm) {
        msg.reply([
            "I am connected/have access to:",
            bot.servers.length + " servers",
            bot.channels.length + " channels",
            bot.users.length + " users",
        ].join("\n"));
        console.log("The user " + usr.username.toString() + " tried to use the stats command");
    }

    if (msg.content.startsWith("slap") && !dm) {
        var randNumMin = 0;
        var fish = ["clown fish", "sword fish", "shark", "sponge cake", "blue berry pie", "banana", "poptart", "the blunt of a sword", "websters dicitonary: hardcopy"];
        var randNumMax = fish.length;
        var pick = (Math.floor(Math.random() * (randNumMax - randNumMin + 1)) + randNumMin);
        bot.sendMessage(msg.channel, msg.mentions[0] + " got slapped with a " + fish[pick] + " by " + usr.toString());
    }

    if (msg.content.startsWith("playing") && dm) {
        console.log(msg.author.id);
        if (msg.author.id == "100748674849579008" || msg.author.id == "104063667351322624") {
            bot.setPlayingGame(msg.content.split(" ").slice(1).join(" "));
        }
    }

    if (msg.content == "summon" && !dm) {
        try {
            if (servers.indexOf(msrv) == -1) {
                if (usr.voiceChannel.server == msrv) {
                    var base = {
                        "server": usr.voiceChannel.server.toString(),
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
                    servers[Vservnum] = msrv;

                    if (!fs.existsSync('./playlists/' + msrv.name)) {
                        fs.mkdirSync('./playlists/' + msrv.name);
                    }
                    playListFiles[Vservnum] = ('./playlists/' + msrv.name + "/" + msrv.name + ".json").toString();
                    if (!fs.existsSync(playListFiles[Vservnum])) {
                        writeJSON(playListFiles[Vservnum], base);
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



    if (msg.content == "destroy" && !dm) {
        try {
            if (servers.indexOf(msrv) != -1) {
                var i = servers.indexOf(msrv);
                var playlist = JSON.parse(fs.readFileSync(playListFiles[i]));
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

    if (msg.content.startsWith("request") && !dm) {

        var songLinkUrl = msg.content.split(" ").slice(1).join(" ");

        songLinkUrl = songLinkUrl.replace("http://", "https://");

        for (Vserver = 0; Vserver < servers.length; Vserver++) {
            if (servers[Vserver].name == msrv.name) {
                if (songLinkUrl.startsWith("https://soundcloud.com/")) {
                    handleSClink(songLinkUrl, playListFiles[Vserver], usr);
                }
                else if (songLinkUrl.startsWith("https://www.youtube.com/playlist?")) {
                    if (downloadingPL == false) {
                        downloadingPL = true;
                        var newplaylist = {
                            "url": songLinkUrl,
                            "usr": usr,
                            "plF": playListFiles[Vserver],
                            "num": Vserver
                        };
                        queuedPLs[queuedPLs.length] = newplaylist;
                        newplaylist = null;
                        ytPlaylist(songLinkUrl, usr, playListFiles[Vserver]);
                    }
                    else {
                        var newplaylist = {
                            "url": songLinkUrl,
                            "usr": usr,
                            "plF": playListFiles[Vserver],
                            "num": Vserver
                        };
                        queuedPLs[queuedPLs.length] = newplaylist;
                        newplaylist = null;
                        bot.sendMessage(chnl, "already downloading a playlist", function(error, message) {
                            bot.deleteMessage(message, {
                                wait: 5000
                            });
                        });
                    }
                }
                else if (songLinkUrl.startsWith("https://www.youtube.com/")) {
                    handleYTlink(songLinkUrl, playListFiles[Vserver], usr, Vserver);
                }
            }

            else if (Vserver == (servers.length - 1) && servers[Vserver].name != msrv.name) {
                msg.reply(["I am not in a voice channel on this server",
                    "Put me in a voice channel if you want to play music"
                ].join("\n"));
            }
        }
    }

    if (msg.content == "play" && !dm) {
        if (servers.indexOf(msrv) != -1) {
            Vserver = servers.indexOf(msrv)

            var playlist = JSON.parse(fs.readFileSync(playListFiles[Vserver]));

            if (playlist.paused == true) {
                playlist.startTime += (Math.floor(bot.uptime / 1000) - playlist.timePaused);
            }
            playNext(bot, Vserver);


            try {
                bot.voiceConnections[Vserver].setVolume(playlist.volume);
            }
            catch (err) {

            }
            writeJSON(playListFiles[Vserver], playlist);
            playlist = null;
        }
        else {
            msg.reply(["I am not in a voice channel on this server",
                "Put me in a voice channel if you want to play music"
            ].join("\n"));
        }

    }

    if (msg.content == "skip" && !dm) {
        if (servers.indexOf(msrv) != -1) {
            Vserver = servers.indexOf(msrv);

            try {
                playStop(bot, Vserver);
            }
            catch (err) {
                console.log("no message to delete");
            }
        }
    }

    if (msg.content.startsWith("pause") && !dm) {
        if (servers.indexOf(msrv) != -1) {
            Vserver = servers.indexOf(msrv);
            bot.voiceConnections[Vserver].stopPlaying();
            var playlist = JSON.parse(fs.readFileSync(playListFiles[Vserver]));
            playlist.currentTime = Math.floor(bot.uptime / 1000) - playlist.startTime;
            playlist.timePaused = Math.floor(bot.uptime / 1000);
            writeJSON(playListFiles[Vserver], playlist);
            playlist = null;
        }
    }

    if (msg.content.startsWith("volume") && !dm) {
        var volume = (msg.content.split(" ").slice(1).join(" ") / 100);
        if (servers.indexOf(msrv) != -1) {
            Vserver = servers.indexOf(msrv);
            var playlist = JSON.parse(fs.readFileSync(playListFiles[Vserver]));
            try {
                bot.voiceConnections[Vserver].setVolume(volume);
                bot.sendMessage(playlist.boundChannel, "Volume set to: " + (volume * 100) + "%");
            }
            catch (err) {
                bot.sendMessage(playlist.boundChannel, "Put me in a voice channel first!");
            }
            playlist.volume = volume;
            writeJSON(playListFiles[Vserver], playlist);
            playlist = null;
            console.log("The user " + usr.toString() + " used the volume command");
            console.log("Volume set to " + (volume * 100) + "%");
        }

    }

    if (msg.content == "shuffle") {
        if (servers.indexOf(msrv) != -1) {
            var i = servers.indexOf(msrv);
            shuffle(playListFiles[i]);
        }
    }
    if (msg.content == "queue") {
        if (servers.indexOf(msrv) != -1) {
            var i = servers.indexOf(msrv);
            queueMsg(playListFiles[i], msg.channel);
        }
    }

});


function playNext(bot, servnum) {

    try {
        play(bot, servnum);
    }
    catch (err) {
        console.log("no music");
    }
}

function playStop(bot, thisServer) {
    if (bot.voiceConnections[thisServer]) {
        var songs = JSON.parse(fs.readFileSync(playListFiles[thisServer]));
        bot.voiceConnections[thisServer].setVolume(songs.volume);
        bot.voiceConnections[thisServer].stopPlaying();
        if (songs.tracks[0].type == "youtube") {
            var songPath = ['./playlists/', songs.server, '/', songs.tracks[0].id, '.mp3'].join("");
            fs.unlinkSync(songPath);
        }
        songs.tracks.splice(0, 1);
        writeJSON(playListFiles[thisServer], songs);
        setTimeout(function() {
            if (songs.tracks.length >= 1)
                playNext(bot, thisServer);
            songs = null;
        }, 100);
    }
}

function play(bot, Vserver) {

    var playlist = JSON.parse(fs.readFileSync(playListFiles[Vserver]));
    console.log("playing music in server " + (Vserver + 1));

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
        bot.sendMessage(playlist.boundChannel, "**Now Playing:** **" + playlist.tracks[0].title + "** In: " + playlist.server, function(error, msg) {
            if (error) { console.log(error); }
            
            playlist.nowplaying = msg.id;
            
            
        });

        if (playlist.paused == false) {
            playlist.startTime = Math.floor(bot.uptime / 1000);
        }
        else {
            playlist.paused = false;
        }
        writeJSON(playListFiles[Vserver], playlist);
    playlist = null;
    }
    catch (err) {
        console.log("What the fuck happened");
    }
    currentStreams[Vserver].on('end', function() {
        setTimeout(function() {
            playStop(bot, Vserver);
        }, 16100);
    });

    currentStreams[Vserver].on('error', function() {
        bot.sendMessage(playlist.boundChannel, "umm not sure what happened");
    });
}

function handleSClink(songLink, playlistFile, usr) {


    var newSong = {};


    try {
        //console.log(songs);
        request("http://api.soundcloud.com/resolve.json?url=" + songLink + "&client_id=" + scKey, function(error, response, body) {

            var songs = JSON.parse(fs.readFileSync(playlistFile));
            body = JSON.parse(body);

            if (body.kind == "track") {
                console.log(body.title + " added by: " + usr.username);
                newSong = {
                    "id": body.id,
                    "title": body.title,
                    "user": usr.username,
                    "type": "soundcloud"
                };
                songs.tracks[songs.tracks.length] = newSong;
            }

            if (body.kind == "playlist") {
                for (var song in body.tracks) {
                    newSong = {
                        "id": body.tracks[song].id,
                        "title": body.tracks[song].title,
                        "user": usr.username,
                        "type": "soundcloud"
                    };
                    songs.tracks[songs.tracks.length] = newSong;
                }
            }
            writeJSON(playlistFile, songs);
            songs = null;
        });
    }
    catch (err) {
        console.log(err);
    }
}

function handleYTlink(songLink, playlistFile, usr, Vserver) {

    var link = songLink.split("v=");
    var id = link[1];
    var size;
    var newSong = {
        "id": id,
        "title": "",
        "user": usr.username,
        "type": "youtube"
    };

    console.log(id);

    var video = ytdl(songLink,
        // Optional arguments passed to youtube-dl.
        ['--format=bestaudio'],
        // Additional options can be given for calling `child_process.execFile()`.
        {
            cwd: __dirname
        });

    // Will be called when the download starts.
    video.on('info', function(info) {
        size = info.size;
        console.log(info);
        console.log('Download started');
        //console.log(info);
        newSong.title = info.title;
    }).pipe(fs.createWriteStream('./playlists/' + servers[Vserver].name + '/' + id + '.mp3'));

    var pos = 0;
    video.on('data', function data(chunk) {
        pos += chunk.length;
        // `size` should not be 0 here.
        if (size) {
            var percent = (pos / size * 100).toFixed(2);
            process.stdout.cursorTo(0);
            process.stdout.clearLine(1);
            process.stdout.write(percent + '%');
            if (percent == 100) {
                console.log("\nDone Downloading!");
                //bot.sendMessage(boundChannels[Vserver], "added one song to the playlist");
                var songs = JSON.parse(fs.readFileSync(playlistFile));
                songs.tracks[songs.tracks.length] = newSong;
                fs.writeFileSync(playlistFile, JSON.stringify(songs, null, "\t"));
                songs = null;
            }
        }
    });



    video.on('complete', function() {
        console.log("just checking");
    });

}



var someSong = {
    "usr": "",
    "file": "",
    "numToDownload": 0,
    "numDownloaded": 0,
    "server": ""
};

var newTracks = [];

function ytPlaylist(url, usr, playlistFile, num) {

    'use strict';
    if (usr != null && playlistFile != null) {
        newTracks = [];
        someSong.numDownloaded = 0;
        someSong.usr = usr.username.toString();
        someSong.file = playlistFile.toString();
        var server = playlistFile.split("/");
        someSong.server = server[2];
    }




    //if (songs != null)
    // someSong.server = songs.server;


    var video = ytdl(url, ['--format=bestaudio']);
    var id = "";
    video.on('error', function error(err) {
        console.log('error 2:', err);
    });


    var size = 0;
    video.on('info', function(info) {
        //console.log(info.n_entries);
        someSong.numToDownload = info.n_entries;
        size = info.size;
        id = info.id;
        var newSong = {
            "id": id,
            "title": info.title,
            "user": someSong.usr,
            "type": "youtube"
        };
        //console.log(newTracks.length);
        newTracks[newTracks.length] = newSong;
        var output = [__dirname, "/playlists/", someSong.server, "/", id, ".mp3"].join("");
        video.pipe(fs.createWriteStream(output));
    });
    var pos = 0;
    video.on('data', function data(chunk) {
        pos += chunk.length;
        // `size` should not be 0 here.
        if (size) {
            var percent = (pos / size * 100).toFixed(2);
            process.stdout.cursorTo(0);
            process.stdout.clearLine(1);
            process.stdout.write(percent + '%');
        }

    });

    video.on('next', ytPlaylist);

    video.on('end', function() {
        someSong.numDownloaded++;
        if (someSong.numDownloaded == someSong.numToDownload) {
            var songs = JSON.parse(fs.readFileSync(someSong.file));
            for (var song in newTracks) {
                songs.tracks[songs.tracks.length] = newTracks[song];
            }
            console.log("\nDone Downloading all the songs");
            writeJSON(someSong.file, songs);
            songs = null;
            queuedPLs.splice(0, 1);
            if (queuedPLs.length > 0) {
                ytPlaylist(queuedPLs.url, queuedPLs.plF, queuedPLs.usr, queuedPLs.num);
            } else
            {
                downloadingPL = false;
            }
        }
    });
}

function shuffle(playlistFile) {
    var song = JSON.parse(fs.readFileSync(playlistFile));
    var newOrder = [];
    var picked = [];
    var getSong = {};
    var totalSongs = (song.tracks.length - 1);
    var randNumMin = 1;
    for (var i = 0; i < song.tracks.length - 1; i++) {
        var index = (Math.floor(Math.random() * (totalSongs - randNumMin + 1)) + randNumMin);
        do {
            index = (Math.floor(Math.random() * (totalSongs - randNumMin + 1)) + randNumMin);
        } while (picked.indexOf(index) != -1);
        getSong = {
            "id": song.tracks[index].id,
            "title": song.tracks[index].title,
            "user": song.tracks[index].user,
            "type": song.tracks[index].type
        };
        newOrder[i] = getSong;
        picked[i] = index;
    }
    for (var i = 1; i < song.tracks.length - 1; i++) {
        song.tracks[i] = newOrder[i];
    }
    bot.sendMessage(song.boundChannel, "**Shuffle :diamonds: Shuffle :spades: Shuffle :hearts:**", function (error, message) {
        bot.deleteMessage(message, {wait: 7000});
    });
    
    
    writeJSON(playlistFile, song);
    setTimeout(function() {
        song = null;
    }, 200);
}

function queueMsg(playlistFile, channel) {
    var queue = ["Current Playlist:", "", ""];
    try {
        var songs = JSON.parse(fs.readFileSync(playlistFile));

        var queueWord = queue;
        var n = 0;

        if (songs.tracks.length > 20) {
            n = 20;
        }
        else {
            n = songs.tracks.length;
        }


        for (var i = 0; i < n; i++) {
            if ((queueWord + "**" + (i + 1) + "**:  `" + songs.tracks[i].title.toString() + "`, **" + songs.tracks[i].user.toString() + "**").length <= 2000 && i < songs.tracks.length) {
                queue.push(("**" + (i + 1) + "**:  `" + songs.tracks[i].title.toString() + "`, **" + songs.tracks[i].user.toString() + "**"));
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
        bot.sendMessage(channel, queueWord, function(error, message) {
            bot.deleteMessage(message, {
                wait: 7000
            });
        });
        songs = null;
    }
    catch (err) {

    }
}

function writeJSON(JSONFile, jsonOb) {
    fs.writeFileSync(JSONFile, JSON.stringify(jsonOb, null, "\t"));
}