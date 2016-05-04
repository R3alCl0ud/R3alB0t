//include discord

var Discord = require("discord.js");
var opus = require('node-opus');
var request = require("request");
var url = require("url");
var fs = require('fs');

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
var dirs = [];
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
        var randNumMax = fish.length;
        var pick = (Math.floor(Math.random() * (randNumMax - randNumMin + 1)) + randNumMin);
        bot.sendMessage(msg.channel, msg.content.split(" ").slice(1).join(" ") + " got slapped with a " + fish[pick] + " by " + msg.author.toString());
    }

    if (msg.content == "summon") {
        try {
            if (servers.indexOf(msg.channel.server) == -1) {
                if (usr.voiceChannel.server == msg.channel.server) {
                    bot.joinVoiceChannel(usr.voiceChannel.id);
                    boundChannels[Vservnum] = msg.channel;
                    servers[Vservnum] = msg.channel.server;
                    dirs[Vservnum] = ('./' + msg.channel.server.name + ".txt");
                    if (!fs.existsSync(dirs[Vservnum])) {
                        fs.writeFileSync(dirs[Vservnum], "");
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

                    bot.voiceConnections[i].destroy();
                    if (fs.existsSync(dirs[i])) {
                        fs.unlinkSync(dirs[i]);
                    }
                    dirs.splice(i, 1);
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
            msg.reply("noot! noot!");
        }
        bot.setPlayingGame("");
    }

    if (msg.content.startsWith("soundcloud")) {

        var songLinkUrl = msg.content.split(" ").slice(1).join(" ");

        for (Vserver = 0; Vserver < servers.length; Vserver++) {
            if (servers[Vserver].name == msrv.name) {
                handleSClink(songLinkUrl, dirs[Vserver], usr);
            }
            else if (Vserver == (servers.length - 1) && servers[Vserver].name != msrv.name) {
                msg.reply(["I am not in a voice channel on this server",
                    "Put me in a voice channel if you want to play music"
                ].join("\n"));
            }
        }
    }

    if (msg.content.startsWith("youtube")) {
        var video = msg.content.split(" ").slice(1);

        bot.voiceConnection.playRawStream(request(video));
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
            else if (Vserver >= (servers.length - 1)) {
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
    if (msg.content == "testnewline") {
        var queue = [];
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
        var songs = fs.readFileSync(dirs[thisServer]).toString().split("\n");
        songs.splice(0, 1);
        fs.writeFileSync(dirs[thisServer], songs[0]);
        for (var i = 1; i < songs.length; i++)
            fs.appendFile(dirs[thisServer], "\n" + songs[i]);
        songs = fs.readFileSync(dirs[thisServer]).toString().split("\n");
        if (songs.length >= 1)
            playNext(bot, thisServer);
    }
}

function play(bot, Vserver) {

    var songs = fs.readFileSync(dirs[Vserver]).toString().split("\n");
    console.log("playing music in server " + (Vserver + 1));


    if (pausedChannels[Vserver] == true) {
        currentStreams[Vserver] = request("http://api.soundcloud.com/tracks/" + songs[0] + "/stream?consumer_key=" + scKey);
    }
    else {
        currentStreams[Vserver] = request("http://api.soundcloud.com/tracks/" + songs[0] + "/stream?client_id=" + scKey);
    }
    try {
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
        bot.voiceConnections[Vserver].setVolume(volumes[Vserver]);
        sendNP(songs[0], Vserver);

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
        }, 16100);
        currentTimes[Vserver] = 0;

    });
    currentStreams[Vserver].on('error', function() {
        bot.sendMessage(boundChannels[Vserver], "umm not sure what happened");
    });
}

function handleSClink(songLink, playlistFile, usr) {

    try {
        request("http://api.soundcloud.com/resolve.json?url=" + songLink + "&client_id=" + scKey, function(error, response, body) {

            body = JSON.parse(body);

            if (body.kind == "track") {
                console.log(body.title + " added by: " + usr.username);
                fs.appendFile(playlistFile, body.id + "\n");
            }
            if (body.kind == "playlist") {
                for (var i = 0; i < body.tracks.length; i++) {
                    fs.appendFile(playlistFile, body.tracks[i].id + "\n");
                    console.log(body.tracks[i].title + " added by: " + usr.username);
                }

            }
        });
    }
    catch (err) {

    }
}

function sendNP(songLink, Vserver) {

    try {
        request("http://api.soundcloud.com/tracks/" + songLink + "?client_id=" + scKey, function(error, response, body) {
            body = JSON.parse(body);
            bot.sendMessage(boundChannels[Vserver], "**Now Playing:** **" + body.title + "** In voice channel " + bot.voiceConnections[Vserver].voiceChannel.name);
        });
    }
    catch (err) {
        console.log(err);
    }

}

function shuffle(playlistFile) {
    var songs = fs.readFileSync(playlistFile).toString().split("\n");
    var newOrder = [];
    var picked = [];
    var totalSongs = (songs.length - 1);

    var randNumMin = 1;
    for (var i = 0; i < totalSongs; i++) {
        var index = (Math.floor(Math.random() * (totalSongs - randNumMin + 1)) + randNumMin);
        do {
            index = (Math.floor(Math.random() * (totalSongs - randNumMin + 1)) + randNumMin);
            //console.log(index);
        } while (picked.indexOf(index) != -1)
        newOrder[i] = songs[index];
        picked[i] = index;
    }

    fs.writeFileSync(playlistFile, songs[0]);
    for (var i = 0; i < newOrder.length; i++)
        fs.appendFile(playlistFile, "\n" + newOrder[i]);
}


function queueMsg(playlistFile, channel) {
    var queue = ["Current Playlist", "", ""];

    var songs = fs.readFileSync(playlistFile).toString().split("\n");

    var queueWord = queue;
    console.log(queueWord.toString());

    var checked = fs.readFileSync('./check.txt').toString();

    for (var i = 0; i < songs.length - 1; i++) {
        var body;
        try {
            request("http://api.soundcloud.com/tracks/" + songs[i] + "?client_id=" + scKey, function(error, response, body) {
                body = JSON.parse(body);;
                //title.push(body);
                if ((queueWord + body.title + ", position: " + i).length <= 200) {
                    queue.push((body.title + ", position: " + (i + 1)));
                    queueWord = queue;
                    console.log(queueWord.toString().length);
                    console.log(queueWord);
                }
                else {
                    checked = fs.readFileSync('./check.txt').toString();
                    fs.writeFileSync(checked, "1");
                    console.log("end of loop");
                    bot.sendMessage(channel, queueWord);
                }
            });
        }
        catch (err) {
            console.log(err);
        }
        checked = fs.readFileSync('./check.txt').toString();
        if (checked == "1")
            break;
    }
}