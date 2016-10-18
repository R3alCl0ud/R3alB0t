const lib = require("../../../lib");
const fs = require('fs');
const request = require('request');
const ytdl = require('youtube-dl');
const DiscordJS = require('discord.js');
const mpegPlayer = new DiscordJS.Collection();
const EventEmitter = require('events').EventEmitter;
const iPod = require('./iPod');

function checkUser(user, server) {
    if (!mpegPlayer.has(server.id)) {
        var Guild = lib.openJSON('./playlists/' + server.id + '/' + server.id + '.json');
        if (!lib.isRoleServer(user, Guild.Role))
            return false;
    }
    else if (!lib.isRoleServer(user, mpegPlayer.get(server.id).Role)) {
        return false;
    }

    return true;
}

class webList extends lib.Command {
    constructor(plugin) {
        this.plugin = plugin;
        this.id = "weblist";
        this.names = ["webPlaylist", "wpl"];
        this.desc = "Give user a link to view the playlist from their web browser";
    }
    func (message, author, channel, server) {
        channel.sendMessage("https://beta.R3alB0t.xyz/playlist/" + server.id);
    }
    
}

class volume extends lib.Command {
    constructor(plugin) {
        super("volume", null, plugin, {names: ["volume", "loudness", "vol", "setvol", "setvolume"], description: "Sets the volume", caseSensitive: false});
        this.Message = function(message, author, channel, server) {
            var Args = message.content.split(" ");
            if (mpegPlayer.has(server.id)) {
                var Player = mpegPlayer.get(server.id);
                if (Args.length == 1) {
                    channel.sendMessage("The volume is `" + (Player.volume * 100) + "%`");
                }
                if (Args.length >= 2) {
                    var volume = parseInt(Args[1], 10) / 100;
                    var Guild = lib.openJSON(Player.plFile);
                    if (Math.abs(volume) <= 2) {
                        Guild.volume = volume;
                        lib.writeJSON(Player.plFile, Guild);
                        channel.sendMessage("Volume set to: `" + (volume * 100) + "%`");
                        Player.setVolume(volume);
                    }
                    else {
                        message.reply("please use a more reasonable volume!");
                    }
                }
            }
        };
    }
}

class summon extends lib.Command {
    constructor(plugin) {
        super("summon", null, plugin, {names: ["summon", "join", "comehere"], caseSensitive: false});
        this.Message = function(message, author, channel, server) {

            if (mpegPlayer.has(server.id)) {
                channel.sendMessage("Already in a voice channel on this server");
                return;
            }

            if (fs.existsSync("./playlists/" + server.id + "/")) {
                if (!checkUser(author, server)) return;
            }

            if (message.member.voiceChannel === null) return;
            
            if (message.member.voiceChannel.guild.id !== server.id) return;

            if (!fs.existsSync("./playlists/" + server.id + "/")) {
                fs.mkdirSync("./playlists/" + server.id + "/");
                try {
                    message.member.voiceChannel.join().then(connection => {
                        mpegPlayer.set(connection.channel.guild.id, new iPod(connection, channel));
                    }).catch(console.log);

                    var defaultJSON = {
                        "id": server.id,
                        "currentTime": 0,
                        "paused": false,
                        "boundChannel": channel.id,
                        "defaultChannel": message.member.voiceChannel.id,
                        "Role": "@everyone",
                        "autoJoin": true,
                        "autoStart": true,
                        "volume": .1,
                        "tracks": []
                    };
                    if (!fs.existsSync("./playlists/" + server.id + "/" + server.id + ".json")) {
                        lib.writeJSON("./playlists/" + server.id + "/" + server.id + ".json", defaultJSON);
                    }
                    channel.sendMessage("now connected to: " + message.member.voiceChannel.name);

                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                const Guild = lib.openJSON('./playlists/' + server.id + '/' + server.id + '.json');
                message.member.voiceChannel.join().then((connection) => {
                    mpegPlayer.set(connection.channel.guild.id, new iPod(connection, channel, Guild));
                    const Player = mpegPlayer.get(server.id);
                    if (Guild.tracks.length >= 1 && !Player.paused && Guild.autoStart) Player.playNext();
                }).catch(console.log);
                channel.sendMessage("now connected to: " + message.member.voiceChannel.name);
            }
        };
    }

}

class getSong extends lib.Command {
    constructor(plugin) {
        super("request", null, plugin, {names: ["request", "soundcloud", "add", "youtube", "yt", "sc"]});
        this.role = "@everyone";
    }
    Message(message, author, channel, server) {

        if (!fs.existsSync(`./playlists/${server.id}/${server.id}.json`)) message.reply("I'm sorry, but there is no playlist for this server yet. Try summoning me first");


        var args = message.content.split(" ");
        var toUpdate;
        var added = 0;
        if (lib.SCRegex.test(args[1])) {
            channel.sendMessage("Adding to playlist").then(msg => {
                toUpdate = msg;
            });
            var newSong = {};
            try {
                request(`http://api.soundcloud.com/resolve.json?url=${args[1]}&client_id=3b16b5507608db3eaace81f41aea90bb`, (error, response, body) => {
                    var songs = lib.openJSON(`./playlists/${server.id}/${server.id}.json`);
                    if (response.statusCode != 200 || error != null) {
                        channel.sendMessage("I cannot stream this song. Either it doesn't exist, or I do not have permission to stream it");
                        toUpdate.delete();
                        return;
                    }


                    if (body != null) {
                        try {
                            body = JSON.parse(body);
                            if (body.kind == "track") {
                                newSong = {
                                    "id": body.id,
                                    "title": body.title,
                                    "user": author.id,
                                    "requester": author.username,
                                    "duration": body.duration,
                                    "type": "soundcloud"
                                };
                                added++;
                                songs.tracks.push(newSong);
                            }
                            if (body.kind == "playlist") {
                                for (var i = 0; i < body.tracks.length; i++) {
                                    newSong = {
                                        "id": body.tracks[i].id,
                                        "title": body.tracks[i].title,
                                        "user": author.id,
                                        "requester": author.username,
                                        "duration": body.tracks[i].duration,
                                        "type": "soundcloud"
                                    };
                                    added++;
                                    songs = lib.openJSON('./playlists/' + server.id + '/' + server.id + '.json');
                                    songs.tracks.push(newSong);
                                    lib.writeJSON('./playlists/' + server.id + '/' + server.id + '.json', songs);
                                }
                            }
                        }
                        catch (err) {
                            message.reply("Umm, that song didn't like me");
                            console.log(err);
                        }
                    }
                    lib.writeJSON(`./playlists/${server.id}/${server.id}.json`, songs);
                    songs = null;
                    toUpdate.edit(`Added ${added} song(s) to the queue`);
                    shuffleOnAdd(added, args, channel, server);
                });
            }
            catch (err) {
                console.log(err);
            }
        }
        else if (lib.YTRegex.test(args[1])) {
            var songs = lib.openJSON(`./playlists/${server.id}/${server.id}.json`);
            channel.sendMessage("Adding to playlist").then(msg => {
                toUpdate = msg;
            });
            ytdl.getInfo(args[1], ["--format=bestaudio"], function(error, info) {
                if (error != null) {
                    console.log(error);
                    return;
                }
                songs = lib.openJSON(`./playlists/${server.id}/${server.id}.json`);
                songs.tracks.push({
                    "url": info.url,
                    "title": info.title,
                    "user": author.id,
                    "requester": author.username,
                    "duration": lib.timeToMs(info.duration),
                    "type": "youtube"
                });
                lib.writeJSON(`./playlists/${server.id}/${server.id}.json`, songs);
                added++;
                songs = null;
                toUpdate.edit(`Added  ${added} song(s) to the queue`);
                shuffleOnAdd(added, args, channel, server);
            });
        }
        else if (lib.YTPlaylistRegex.test(args[1])) {
            console.log("got a youtube link");
            var songs = lib.openJSON(`./playlists/${server.id}/${server.id}.json`);
            channel.sendMessage("Adding to playlist").then(msg => {
                toUpdate = msg;
            });
            ytdl.getInfo(args[1], ["--format=bestaudio"], function(error, info) {
                if (error != null) {
                    console.log(error);
                    return;
                }
                for (var track in info) {
                    added++;
                    songs = lib.openJSON(`./playlists/${server.id}/${server.id}.json`);
                    songs.tracks[songs.tracks.length] = {
                        "url": info[track].url,
                        "title": info[track].title,
                        "user": author.id,
                        "requester": author.username,
                        "duration": lib.timeToMs(info[track].duration),
                        "type": "youtube"
                    };
                    lib.writeJSON(`./playlists/${server.id}/${server.id}.json`, songs);
                }
                lib.writeJSON(`./playlists/${server.id}/${server.id}.json`, songs);
                songs = null;
                toUpdate.edit(`Added ${added} song(s) to the queue`);
                shuffleOnAdd(added, args, channel, server);
            });
        }
    }
}

function shuffleOnAdd(added, args, channel, server) {
   //console.log(added)
   //console.log(lib.openJSON(`./playlists/${server.id}/${server.id}.json`).tracks.length)
    if (args.length >= 3) {
        if (added == lib.openJSON(`./playlists/${server.id}/${server.id}.json`).tracks.length && args[2].toLowerCase() == "shuffle") {
            if (mpegPlayer.has(server.id)) {
                var songs = lib.openJSON(mpegPlayer.get(server.id).plFile);
    
                var playlist = songs.tracks;
    
                for (var i = playlist.length - 1; i > 1; i--) {
                    var n = Math.floor(Math.random() * (i + 1));
                    
                        var temp = playlist[i];
                        playlist[i] = playlist[n];
                        playlist[n] = temp;
                }
    
                songs.tracks = playlist;
    
                channel.sendMessage("**Shuffle :diamonds: Shuffle :spades: Shuffle :hearts:**").then(message => {
                    message.delete(7000);
                }).catch(console.log);
                lib.writeJSON(mpegPlayer.get(server.id).plFile, songs);
                songs = null;
            }
        }
        else {
            channel.sendMessage("Playlist must be empty to shuffle first song");
        }
    }
    if (mpegPlayer.has(server.id)) {
        if (!mpegPlayer.get(server.id).paused) {
            mpegPlayer.get(server.id).playNext();
        }
    }
}

class destroy extends lib.Command {
    constructor(plugin) {
        super("destroy", null, plugin);
        this.setAlias(["destroy", "leave"]);
        this.role = "@everyone";
    }
    Message(message, author, channel, server) {
        if (mpegPlayer.has(server.id)) {
            try {
                mpegPlayer.get(server.id).destroy();
                mpegPlayer.delete(server.id);
            }
            catch (err) {
                message.reply("Holy shit Batman!! Something went wrong! Heres the log: ```js\n" + err + "```");
                console.log(err);
            }
        }
    }
}
class play extends lib.Command {
    constructor(plugin) {
        super("play", null, plugin);
        this.role = "@everyone";
        this.Message = function(message, author, channel, server) {
            if (mpegPlayer.has(server.id)) {
                try {
                    mpegPlayer.get(server.id).playNext();
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                message.reply("not in a voice channel");
            }
        };
    }
}

class resume extends lib.Command {
    constructor(plugin) {
        super("resume", null, plugin);
        this.setAlias(["resume"]);
        this.role = "@everyone";
        this.Message = function(message, author, channel, server) {
            if (mpegPlayer.has(server.id)) {
                try {
                    mpegPlayer.get(server.id).resume();
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                message.reply("not in a voice channel");
            }
        };
    }
}


class queueMsg extends lib.Command {

    constructor(plugin) {
        super("playlist", null, plugin, {caseSensitive: false});
        this.setAlias(["browser", "queue", "playlist", "pl"]);
        this.role = "@everyone";
        this.Message = (message, author, channel, server) => {
            var queue = ["Current Playlist:\n\n"];
            try {
                var songs = lib.openJSON('./playlists/' + server.id + '/' + server.id + '.json');
                var queueWord = queue;
                var n = 0;
                var tracks = songs.tracks;
                if (songs.tracks.length > 20) {
                    n = 20;
                }
                else {
                    n = songs.tracks.length;
                }
                if (n != 0) {
                    for (var i = 0; i < n; i++) {
                        if ((queueWord + "**" + (i + 1) + "**:  `" + tracks[i].title.toString() + "`, <@" + tracks[i].user.toString() + ">").length <= 2000 && i < tracks.length) {
                            queue.push(("**" + (i + 1) + "**:  `" + tracks[i].title.toString() + "`, <@" + tracks[i].user.toString() + ">"));
                            queueWord = queue;
                        }
                        else {
                            break;
                        }
                    }
                    queue.push("\n\nPlaylist total length: " + songs.tracks.length);
                    queueWord = queue;
                } else {
                    queueWord = ["There are currently no items in your queue!"]
                }
                
                
                channel.startTyping();
                setTimeout(function() {
                    channel.stopTyping();
                    channel.sendMessage(queueWord.join("\n")).then(message => {
                        message.delete(17000);
                    }).catch(console.log);
                }, 750);
                songs = null;
            }
            catch (err) {
                console.log(err);
            }
        };
    }
}


class skip extends lib.Command {
    constructor(plugin) {
        super("skip", null, plugin, {names: ["skip", "next", "newsong", "playnext"]});
        this.role = "@everyone";
    }
    Message (message, author, channel, server) {

        if (!mpegPlayer.has(server.id)) return;

        if (!checkUser(message.member, server)) return;

        message.reply("skipping");
        mpegPlayer.get(server.id).skip();
    }
}

class pause extends lib.Command {

    constructor(plugin) {
        super("pause", null, plugin, {names: ["pause", "stop", "stopmusic"]});
    }
    Message (msg, author, channel, srv) {
        if (mpegPlayer.has(srv.id)) {
            const Player = mpegPlayer.get(srv.id);
            if (Player.paused) return;
            Player.pause();
        }
    }
}
class shuffle extends lib.Command {
    constructor(plugin) {
        super("shuffle", null, plugin);
        this.setAlias(["shuffle", "randomize"]);
        this.role = "@everyone";
        this.Message = function(message, author, channel, server) {
            if (mpegPlayer.has(server.id)) {
                var songs = lib.openJSON(mpegPlayer.get(server.id).plFile);

                var playlist = songs.tracks;

                for (var i = playlist.length - 1; i > 1; i--) {
                    var n = Math.floor(Math.random() * (i + 1));
                    if (n != 0) {
                        var temp = playlist[i];
                        playlist[i] = playlist[n];
                        playlist[n] = temp;
                    }
                    else {
                        i++;
                    }
                }

                songs.tracks = playlist;

                channel.sendMessage("**Shuffle :diamonds: Shuffle :spades: Shuffle :hearts:**").then(message => {
                    message.delete(7000);
                }).catch(console.log);
                lib.writeJSON(mpegPlayer.get(server.id).plFile, songs);
                songs = null;
            }
        };
    }
}
class clearplaylist extends lib.Command {
    constructor(plugin) {
        super("clearplaylist", null, plugin);
        this.setAlias(["cpl", "clearplaylist", "clearpl", "playlistclear"]);
        this.role = "@everyone";
        this.Message = function(message, author, channel, server) {
            if (mpegPlayer.has(server.id)) {
                try {
                    var songs = lib.openJSON(mpegPlayer.get(server.id).plFile);
                    songs.tracks = [];
                    mpegPlayer.get(server.id).stopPlaying();
                    lib.writeJSON(mpegPlayer.get(server.id).plFile, songs);
                }
                catch (err) {
                    console.log(err);
                }
            }
        };
    }
}




var setRole = function(message, author, channel, server) {
    var Args = message.content.split(" ");
    if (Args.length >= 2) {
        if (mpegPlayer.hasOwnProperty(server.id)) {
            var guild = mpegPlayer[server.id];
            var Guild = lib.openJSON(mpegPlayer[server.id].plFile);
            if (lib.isRole(message, author, guild.Role) || server.owner.equals(author) || lib.hasPerms(author, server, "manageServer")) {
                guild.Role = Args[1];
                Guild.Role = guild.Role;
            }
            else {
                channel.sendMessage("You don't have permission to change this setting");
            }
        }
    }
    else {
        channel.sendMessage("invalid argument count");
    }
};

var setJoin = function(message, author, channel, server) {

};


class config extends lib.Command {
    constructor(plugin) {
        this.plugin = plugin;
        this.id = "config";
        this.role = "@everyone";
        this.names = ["config", "configure"];
        this.func = function(message, author, channel, server) {

            var Args = message.content.split(" ");

            if (Args.length < 2) return;

            var configs = {
                role: setRole,
                autojoin: setJoin
            };

            if (configs.hasOwnProperty(Args[1].toLowerCase())) {
                message.content = Args.splice(0, 1).join(" ");
                configs[Args[1]](message, author, channel, server);
            }


        };
    }
}


function startUp(channels, index) {

    if (fs.existsSync("./playlists")) {
        var dir = fs.readdirSync("./playlists");

        if (index == dir.length) return;

        var current = fs.readdirSync("./playlists/" + dir[index]);
        var Guild = lib.openJSON("./playlists/" + dir[index] + "/" + current[0]);
        if (!Guild.hasOwnProperty("Role"))
            Guild.Role = "DJ";
        if (!Guild.hasOwnProperty("autoJoin"))
            Guild.autoJoin = false;
        if (!Guild.hasOwnProperty("defaultChannel"))
            Guild.defaultChannel = null;
        if (!Guild.hasOwnProperty("boundChannel"))
            Guild.boundChannel = null;
        if (Guild.hasOwnProperty("server")) 
            Guild.id = Guild.server;
        

        lib.writeJSON("./playlists/" + dir[index] + "/" + current[0], Guild);

        if (Guild.autoJoin == true && Guild.defaultChannel != null && channels.has(Guild.defaultChannel)) {
            channels.get(Guild.defaultChannel).join().then((connection) => {

                mpegPlayer.set(Guild.id, new iPod(connection, channels.get(Guild.boundChannel), Guild));

                if (mpegPlayer.get(Guild.id).autoStart == true && Guild.tracks.length > 0 && connection.channel.members.length > 1 && !mpegPlayer.get(Guild.id).paused)
                    mpegPlayer.get(Guild.id).playNext();
                startUp(channels, index + 1);
            }).catch(console.log);
        }
    }
}



function handleNewRole(server, role) {

    if (mpegPlayer.hasOwnProperty(server.id)) {
        mpegPlayer[server.id].Role = role;
        var Guild = lib.openJSON(mpegPlayer[server.id].plFile);
        Guild.Role = role;
        lib.writeJSON(mpegPlayer[server.id].plFile, Guild);
    }
}


module.exports = class commands extends EventEmitter{
    constructor(plugin) {
        super()
        if (plugin != null) {
            this.plugin = plugin;
        }
    }

    register() {
        // CommandRegistry.registerPrefix(this.plugin, "$$");
        this.plugin.registerCommand(new volume(this.plugin));
        this.plugin.registerCommand(new summon(this.plugin));
        this.plugin.registerCommand(new destroy(this.plugin));
        this.plugin.registerCommand(new getSong(this.plugin));
        this.plugin.registerCommand(new play(this.plugin));
        this.plugin.registerCommand(new resume(this.plugin));
        this.plugin.registerCommand(new queueMsg(this.plugin));
        this.plugin.registerCommand(new pause(this.plugin));
        this.plugin.registerCommand(new shuffle(this.plugin));
        this.plugin.registerCommand(new skip(this.plugin));
        this.plugin.registerCommand(new clearplaylist(this.plugin));
        // CommandRegistry.registerCommand(new config(this.plugin));
        // this.plugin.registerCommand(new webList(this.plugin));
        startUp(this.plugin.channels, 0);

        // this.plugin.bot.on("updateRole", handleNewRole);
    }
};
