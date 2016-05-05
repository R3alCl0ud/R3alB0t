//include discord

var Discord = require("discord.js");
var opus = require('node-opus');
var request = require("request");
var url = require("url");
var fs = require('fs');
var json = require('jsonfile');
var ytdl = require('youtube-dl');
var path = require('path');

var bot = new Discord.Client({
    autoReconnect: true
});

// grab all of those options
var config = require("./options.json");

var option = config.options;

// command prefix
var prefix = option.prefix;

// don't forget your soundcloud api key
var scKey = option.streamKey;

// Get the email and password
var AuthDetails = config.Auth;


// all of my variable arrays for multi voice music playing
var boundChannels = [];
var servers = [];
var currentStreams = [];
var dirs = []; // each servers playlist json file
var folders = []; // the folders for storing mp3s from youtube
var Vserver = 0;
var Vservnum = 0;
var playlists = [];
var addedby = [];
var songtype = [];
var pausedChannels = [];
var timesPaused = [];
var pausedTimes = [];
var currentTimes = [];
var startTimes = [];
var nowplaying = [];

var title = [];

//var volume = config.volume;
var volumes = [];

// Video that is currently being played
var currentVideo = false;

// Last video played
var lastVideo = false;



var test = [];

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


    var usr = msg.author;
    var msrv = msg.channel.server;
    var dm = msg.channel.isPrivate;

    if (msg.content.startsWith("https://discord.gg/") && dm) {
        bot.joinServer(msg.content);
        console.log("joined a new server");

    }

    if (msg.content.startsWith("**Now Playing:**")) {
        for (var i = 0; i < servers.length; i++) {
            if (servers[i] == msg.channel.server)
                nowplaying[i] = msg;
        }
    }



    if (!msg.content.startsWith(prefix)) return;

    msg.content = msg.content.substr(prefix.length);



    if (msg.content.startsWith("admin")) {
        if (admins.indexOf(msg.author.id.toString()) != -1) {
            var x = admins.legnth;
            admins[x] = msg.mentions[0].id;
            fs.appendFile("admins.txt", "\n" + admins[x]);
            msg.reply(" successfully added: " + msg.content.split(" ").slice(1).join(" "));
            console.log(msg.author.id.toString() + " successfully added: " + msg.mentions[0].id);
        }
        else {
            console.log(msg.author.toString() + " unsuccessfully tried to add: " + msg.mentions[0].id);
            msg.reply(" warning you tried to add: " + msg.content.split(" ").slice(1).join(" ") + " but don't have perms! do it again and an admin will be notified");
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
        var randNumMax = fish.length;
        var pick = (Math.floor(Math.random() * (randNumMax - randNumMin + 1)) + randNumMin);
        bot.sendMessage(msg.channel, msg.content.split(" ").slice(1).join(" ") + " got slapped with a " + fish[pick] + " by " + msg.author.toString());
    }

    if (msg.content == "summon") {
        try {
            if (servers.indexOf(msg.channel.server) == -1) {
                if (usr.voiceChannel.server == msg.channel.server) {
                    var base = JSON.stringify({
                        "server": usr.voiceChannel.server.toString(),
                        "tracks": []
                    }, null, "\t");
                    bot.joinVoiceChannel(usr.voiceChannel.id);
                    boundChannels[Vservnum] = msg.channel;
                    servers[Vservnum] = msg.channel.server;
                    dirs[Vservnum] = ('./' + msg.channel.server.name + ".json");
                    if (!fs.existsSync(dirs[Vservnum])) {
                        fs.writeFileSync(dirs[Vservnum], base);
                    }
                    folders[Vservnum] = ('./' + msg.channel.server.name);
                    if (!fs.existsSync(folders[Vservnum])) {
                        fs.mkdirSync(folders[Vservnum]);
                    }
                    console.log("joined voice channel: " + usr.voiceChannel.name + " in server: " + msg.channel.server.toString());
                    pausedChannels[Vservnum] = false;
                    currentStreams[Vservnum] = false;
                    volumes[Vservnum] = option.volume;
                    Vservnum++;
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
        dirs[Vservnum] = ("./" + msg.channel.server.name + ".txt");
        if (!fs.existsSync(dirs[Vservnum])) {
            fs.writeFile(dirs[Vservnum], "");
        }
        Vservnum++;
        console.log("I am connected to " + Vservnum + " voice channel(s)");
        //bot.voiceConnection.setVolume(0.05);
    }

    if (msg.content == "destroy") {
        try {
            for (var i = 0; i < servers.length; i++) {
                if (servers[i] == msg.channel.server) {
    
                    
                    var playlist = JSON.parse(fs.readFileSync(dirs[i]));

                    for (var n = 0; n < playlist.tracks.length - 1; n++)
                    {
                        if (playlist.tracks[n].type == "youtube")
                        {
                            var songPath = ("./" + servers[i].name.toString() + "/" + playlist.tracks[n].id.toString() + ".mp3");
                            if (fs.existsSync(songPath))
                            {
                                fs.rmdirSync(songPath);
                            }
                        }
                    }

                    bot.voiceConnections[i].destroy();
                    if (fs.existsSync(dirs[i])) {
                        fs.unlinkSync(dirs[i]);
                    }
                    
                    
                    
                    if (fs.existsSync(folders[i])) {
                        fs.rmdirSync(folders[i]);
                    }
                    dirs.splice(i, 1);
                    folders.splice(i, 1);
                    servers.splice(i, 1);
                    boundChannels.splice(i, 1);
                    volumes.splice(i, 1);
                    currentStreams.splice(i, 1);
                    pausedChannels.splice(i, 1);
                    nowplaying.splice(i, 1);
                    Vservnum--;
                    console.log("I am connected to " + Vservnum + " voice channel(s)");
                }
            }
        }
        catch (err) {
            msg.reply("well... this is akward. destroy is broken...");
        }
        bot.setPlayingGame("");
    }

    if (msg.content.startsWith("request")) {

        var songLinkUrl = msg.content.split(" ").slice(1).join(" ");

        songLinkUrl = songLinkUrl.replace("http://", "https://");

        for (Vserver = 0; Vserver < servers.length; Vserver++) {
            if (servers[Vserver].name == msrv.name) {
                if (songLinkUrl.startsWith("https://soundcloud.com/")) {
                    handleSClink(songLinkUrl, dirs[Vserver], usr);
                }
                else if (songLinkUrl.startsWith("https://www.youtube.com/playlist?")) {
                    ytPlaylist(songLinkUrl, usr, dirs[Vserver]);
                }
                else if (songLinkUrl.startsWith("https://www.youtube.com/")) {
                    handleYTlink(songLinkUrl, dirs[Vserver], usr, Vserver);
                }
            }
            else if (Vserver == (servers.length - 1) && servers[Vserver].name != msrv.name) {
                msg.reply(["I am not in a voice channel on this server",
                    "Put me in a voice channel if you want to play music"
                ].join("\n"));
            }
        }
    }

    if (msg.content.startsWith("yt")) {
        var songLinkUrl = msg.content.split(" ").slice(1).join(" ");
        try {
            bot.voiceConnection.playRawStream(request(songLinkUrl));
        }
        catch (err) {
            console.log("what");
        }
    }


    if (msg.content == "play") {
        for (Vserver = 0; Vserver < servers.length; Vserver++) {
            if (servers[Vserver].name == msrv.name) {
                playNext(bot, Vserver);
                timesPaused[Vserver] = (bot.uptime / 1000);
                try {
                    bot.voiceConnections[Vserver].setVolume(volumes[Vserver]);
                }
                catch (err) {

                }
            }
            else if (Vserver == (servers.length - 1) && servers[Vserver].name != msrv.name) {
                msg.reply(["I am not in a voice channel on this server",
                    "Put me in a voice channel if you want to play music"
                ].join("\n"));
            }
        }
    }

    if (msg.content == "skip") {
        for (var i = 0; i < servers.length; i++) {
            if (servers[i].name == msrv.name) {
                playStop(bot, i);
                try {
                    bot.deleteMessage(nowplaying[Vserver]);
                }
                catch (err) {
                    console.log("no message to delete");
                }
            }
        }
    }

    if (msg.content.startsWith("pause")) {
        for (var i = 0; i < servers.length; i++) {
            if (servers[i].name == msrv.name) {
                bot.voiceConnections[i].stopPlaying();
                pausedChannels[i] = true;
                pausedTimes[i] = bot.uptime / 1000;
                currentTimes[i] = (bot.uptime / 1000) - startTimes[i];
            }
        }
    }

    if (msg.content.startsWith("volume")) {
        var volume = (msg.content.split(" ").slice(1).join(" ") / 100);
        for (var i = 0; i < servers.length; i++) {
            if (servers[i] == msg.channel.server) {
                try {
                    bot.voiceConnections[i].setVolume(volume);
                    bot.sendMessage(boundChannels[i], "Volume set to: " + (volume * 100) + "%");
                }
                catch (err) {
                    bot.sendMessage(boundChannels[i], "Put me in a voice channel first!");
                }
                console.log("The user " + msg.author.username.toString() + " used the volume command");
                console.log("Volume set to " + (volume * 100) + "%");
            }
        }
    }

    if (msg.content == "shuffle") {
        for (var i = 0; i < servers.length; i++) {
            if (servers[i] == msg.channel.server) {
                shuffle(dirs[i]);
            }
        }
    }
    if (msg.content == "queue") {
        for (var i = 0; i < servers.length; i++) {
            if (servers[i] == msg.channel.server) {
                queueMsg(dirs[i], msg.channel);
            }
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
    if (bot.voiceConnection) {
        bot.voiceConnections[thisServer].setVolume(volumes[thisServer]);
        bot.voiceConnections[thisServer].stopPlaying();
        var songs = JSON.parse(fs.readFileSync(dirs[thisServer]));
        songs.tracks.splice(0, 1);
        fs.writeFileSync(dirs[thisServer], JSON.stringify(songs, null, "\t"));
        if (songs.tracks.length >= 1)
            playNext(bot, thisServer);
    }
}

function play(bot, Vserver) {

    var playlist = JSON.parse(fs.readFileSync(dirs[Vserver]));
    console.log("playing music in server " + (Vserver + 1));

    if (playlist.tracks[0].type == "soundcloud")
    {
        if (pausedChannels[Vserver] == true) {
            currentStreams[Vserver] = request("http://api.soundcloud.com/tracks/" + playlist.tracks[0].id + "/stream?consumer_key=" + scKey);
        }
        else {
            currentStreams[Vserver] = request("http://api.soundcloud.com/tracks/" + playlist.tracks[0].id + "/stream?client_id=" + scKey);
        }
    } else if (playlist.tracks[0].type == "youtube")
    {
        currentStreams[Vserver] = fs.createReadStream(('./' + servers[Vserver].name.toString() + '/' + playlist.tracks[0].id + '.mp3'));
    }
    try {
        if (playlist.tracks[0].type == "soundcloud")
        {
            if (pausedChannels[Vserver] == true) {
                bot.voiceConnections[Vserver].playRawStream(currentStreams[Vserver], {
                    seek: currentTimes[Vserver],
                    volume: volumes[Vserver]
                });
            }
            if (pausedChannels[Vserver] == false) {
                bot.voiceConnections[Vserver].playRawStream(currentStreams[Vserver], {
                    volume: volumes[Vserver]
                });
            }
        } else if (playlist.tracks[0].type == "youtube")
        {
            if (pausedChannels[Vserver] == true) {
                bot.voiceConnections[Vserver].playFile(('./' + servers[Vserver].name + '/' + playlist.tracks[0].id + '.mp3'), {
                    seek: currentTimes[Vserver],
                    volume: volumes[Vserver]
                });
            }
            if (pausedChannels[Vserver] == false) {
                bot.voiceConnections[Vserver].playRawStream(currentStreams[Vserver], {
                    volume: volumes[Vserver]
                });
            }   
        }
        bot.voiceConnections[Vserver].setVolume(volumes[Vserver]);
        bot.sendMessage(boundChannels[Vserver], "**Now Playing:** **" + playlist.tracks[0].title + "** In voice channel " + playlist.server);
        try {
            bot.deleteMessage(nowplaying[Vserver]);
        }
        catch (err) {
            console.log("no message to delete");
        }


        if (pausedChannels[Vserver] == false) {
            startTimes[Vserver] = (bot.uptime / 1000);
        }
        else {
            startTimes[Vserver] += timesPaused[Vserver];
            pausedChannels[Vserver] = false;
        }

    }
    catch (err) {
        console.log("What the fuck happened");
    }
    currentStreams[Vserver].on('end', function() {
        setTimeout(function() {
            playStop(bot, Vserver);
            if (playlist.tracks[0].type == "youtube"){
                fs.unlinkSync(('./' + servers[Vserver].name + '/' + playlist.tracks[0].id + '.mp3'));
            }
        }, 16100);
        currentTimes[Vserver] = 0;

    });
    currentStreams[Vserver].on('error', function() {
        bot.sendMessage(boundChannels[Vserver], "umm not sure what happened");
    });
}

function handleSClink(songLink, playlistFile, usr) {

    var newSong = {};
    var songs = JSON.parse(fs.readFileSync(playlistFile));
    var songsNum = songs.tracks.length;

    try {
        console.log(songs);
        request("http://api.soundcloud.com/resolve.json?url=" + songLink + "&client_id=" + scKey, function(error, response, body) {

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
                for (var i = 0; i < body.tracks.length; i++) {
                    newSong = {
                        "id": body.tracks[i].id,
                        "title": body.tracks[i].title,
                        "user": usr.username,
                        "type": "soundcloud"
                    };
                    songs.tracks[songsNum + i] = newSong;
                }
            }
            fs.writeFileSync(playlistFile, JSON.stringify(songs, null, "\t"));
        });
    }
    catch (err) {
        console.log(err);
    }
}

function handleYTlink(songLink, playlistFile, usr, Vserver) {

    var filename;
    
    var link = songLink.split("v=");
    
    var id = link[1];
    
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
        filename = info._filename;
        console.log('Download started');
        console.log('filename: ' + id);
        console.log('size: ' + info.size);
        
        var songs = JSON.parse(fs.readFileSync(playlistFile));
        var newSong = {
            "id": id,
            "title": info.title,
            "user": usr.username,
            "type": "youtube"
        };
        songs.tracks[songs.tracks.length] = newSong;
        fs.writeFileSync(playlistFile, JSON.stringify(songs, null, "\t"));
        
    }).pipe(fs.createWriteStream('./' + servers[Vserver].name + '/' + id + '.mp3'));

    return;
}

function ytPlaylist(url, usr, playlistFile) {

    'use strict';
    var video = ytdl(url);
    var songs = JSON.parse(fs.readFileSync(playlistFile));

    video.on('error', function error(err) {
        //console.log('error 2:', err);
    });

    var size = 0;
    video.on('info', function(info) {
        var newSong = {
            "id": info.id,
            "title": info.title,
            "user": usr.username,
            "type": "youtube"
        };
        songs.tracks[songs.tracks.length] = newSong;
        fs.writeFileSync(playlistFile, JSON.stringify(songs, null, "\t"));
        
        size = info.size;
        var output = path.join(songs.server.toString() + '/', info.id.toString() + '.mp3');
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

}



function shuffle(playlistFile) {
    var song = JSON.parse(fs.readFileSync(playlistFile));
    var newOrder = [];
    var picked = [];
    var getSong = {};
    var totalSongs = (song.tracks.length - 1);
    var randNumMin = 1;
    for (var i = 0; i < totalSongs; i++) {
        var index = (Math.floor(Math.random() * (totalSongs - randNumMin + 1)) + randNumMin);
        do {
            index = (Math.floor(Math.random() * (totalSongs - randNumMin + 1)) + randNumMin);
        } while (picked.indexOf(index) != -1)
        getSong = {
            "id": song.tracks[index].id,
            "title": song.tracks[index].title,
            "user": song.tracks[index].user,
            "type": song.tracks[index].type
        }
        newOrder[i] = getSong;
        picked[i] = index;
    }
    for (var i = 1; i < song.tracks.length - 1; i++) {
        song.tracks[i] = newOrder[i];
    }
    fs.writeFileSync(playlistFile, JSON.stringify(song, null, "\t"));
}

function queueMsg(playlistFile, channel) {
    var queue = ["Current Playlist:", "", ""];
    try {
        var songs = JSON.parse(fs.readFileSync(playlistFile));

        var queueWord = queue;
        for (var i = 0; i < 20; i++) {
            if ((queueWord + "**" + (i + 1) + "**:  `" + songs.tracks[i].title.toString() + "`, **" + songs.tracks[i].user.toString() + "**").length <= 2000 && i < songs.tracks.length) {
                queue.push(("**" + (i + 1) + "**:  `" + songs.tracks[i].title.toString() + "`, **" + songs.tracks[i].user.toString() + "**"));
                queueWord = queue;
            }
            else {
                break;
            }
        }
        bot.sendMessage(channel, queueWord);
    }
    catch (err) {

    }
}