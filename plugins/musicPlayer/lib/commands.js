"use strict";
var lib = require("../../../lib");
var fs = require('fs');
var request = require('request');
var ytdl = require('youtube-dl');
var mpegPlayer = {};
var cmdReg;

class iPod {
    constructor(bot, voiceConnection, channel, data) {
        this.bot = bot;
        this.voiceConnection = voiceConnection;
        this.voiceChannel = voiceConnection.voiceChannel.id;
        this.server = voiceConnection.server.id;
        this.boundChannel = data.boundChannel || channel.id;
        this.np = null;
        this.paused = data.paused || false;
        this.playing = false;
        this.ending = false;
        this.plFile = './playlists/' + this.server + '/' + this.server + '.json';
        this.currentTime = data.currentTime || 0;
        this.volume = data.volume || 0.1;
        this.currentStream = false;
        this.keys = {
            soundcloud: "3b16b5507608db3eaace81f41aea90bb"
        };
        this.Role = data.Role || "DJ";
        this.autoStart = data.autoStart || true;
    }

    destroy() {
        this.voiceConnection.destroy();
    }
}


function playNext(srv) {
    var playlist = lib.openJSON(mpegPlayer[srv.id].plFile);
    playlist.tracks.splice(0, 1);
    mpegPlayer[srv.id].currentTime = 0;
    lib.writeJSON(mpegPlayer[srv.id].plFile, playlist);
    mpegPlayer[srv.id].bot.deleteMessage(mpegPlayer[srv.id].np);
    mpegPlayer[srv.id].playing = false;
    playMusic(srv);
}


function playMusic(srv) {
    var playlist = lib.openJSON(mpegPlayer[srv.id].plFile);

    if (mpegPlayer[srv.id].playing) return;

    if (playlist.tracks.length <= 0) {
        mpegPlayer[srv.id].playing = false;
        return;
    } else if (playlist.tracks.length > 0) {
        mpegPlayer[srv.id].playing = true;
        var song = playlist.tracks[0];
        if (song.type == "soundcloud") {
            mpegPlayer[srv.id].currentStream = request("http://api.soundcloud.com/tracks/" + song.id + "/stream?client_id=" + mpegPlayer[srv.id].keys.soundcloud);
            try {
                mpegPlayer[srv.id].voiceConnection.playRawStream(mpegPlayer[srv.id].currentStream, {
                    seek: mpegPlayer[srv.id].currentTime,
                    volume: mpegPlayer[srv.id].volume
                });
                mpegPlayer[srv.id].bot.sendMessage(mpegPlayer[srv.id].boundChannel, "**Now Playing: " + song.title + "**", (error, message) => {
                    console.log(message.id);
                    mpegPlayer[srv.id].np = message;
                });
            } catch (err) {
                console.log(err);
            }
        } else if (song.type == "youtube") {
            mpegPlayer[srv.id].currentStream = request(song.url);
            try {
                mpegPlayer[srv.id].voiceConnection.playRawStream(mpegPlayer[srv.id].currentStream, {
                    seek: mpegPlayer[srv.id].currentTime,
                    volume: mpegPlayer[srv.id].volume
                });
                mpegPlayer[srv.id].bot.sendMessage(mpegPlayer[srv.id].boundChannel, "**Now Playing: " + song.title + "**", (error, message) => {
                    mpegPlayer[srv.id].np = message.id;
                });
            } catch (err) {
                console.log(err);
            }
        }
        mpegPlayer[srv.id].currentStream.on('end', () => {
            setTimeout(function() {
                try {
                    playNext(srv);
                } catch (err) {
                    console.log(err);
                }
            }, 16000);
        });
    }
}

function checkUser(user, server) {
    if (!mpegPlayer.hasOwnProperty(server.id)) {
        var Guild = lib.openJSON('./playlists/' + server.id + '/' + server.id + '.json');
        if (!lib.isRoleServer(user, server, Guild.Role))
            return false;
    } else if (!lib.isRoleServer(user, server, mpegPlayer[server.id].Role)) {
        return false;
    }

    return true;
}



class volume {
    constructor(plugin) {
        this.plugin = plugin;
        this.id = "volume";
        this.names = ["volume", "loudness", "vol", "setvol", "setvolume"];
        this.desc = "Sets the volume";
        this.func = function(bot, msg, usr, channel, server) {
            var Args = msg.content.split(" ");
            if (mpegPlayer.hasOwnProperty(server.id)) {
                if (Args.length == 1) {
                    bot.sendMessage(channel, "The volume is `" + (mpegPlayer[server.id].volume * 100) + "%`");
                }
                if (Args.length >= 2) {
                    var volume = parseInt(Args[1], 10) / 100;
                    var Guild = lib.openJSON(mpegPlayer[server.id].plFile);
                    if (Math.abs(volume) <= 2) {
                        mpegPlayer[server.id].volume = volume;
                        Guild.volume = volume;
                        lib.writeJSON(mpegPlayer[server.id].plFile, Guild);
                        bot.sendMessage(mpegPlayer[server.id].boundChannel, "Volume set to: `" + (volume * 100) + "%`");
                        mpegPlayer[server.id].voiceConnection.setVolume(volume);
                    } else {
                        msg.reply("please use a more reasonable volume!");
                    }
                }
            }
        }
    }
}


class summon {
    constructor(plugin) {
        this.plugin = plugin;
        this.id = "summon"
        this.names = ["summon", "join", "comehere"];
        this.role = "@everyone"
        this.func = function(bot, msg, usr, channel, server) {

            if (mpegPlayer.hasOwnProperty(server.id)) {
                bot.sendMessage(channel, "Already in a voice channel on this server");
                return;
            }

            if (fs.existsSync("./playlists/" + server.id + "/")) {
                if (!checkUser(usr, server)) return;
            }

            if (usr.voiceChannel != null) {
                if (!fs.existsSync("./playlists/" + server.id + "/")) {
                    fs.mkdirSync("./playlists/" + server.id + "/");
                    try {
                        bot.joinVoiceChannel(usr.voiceChannel, (error, connection) => {
                            if (error != null) console.log(err);
                            mpegPlayer[server.id] = new iPod(bot, connection, channel);
                        });
                        var defaultJSON = {
                            "current": 0,
                            "start": 0,
                            "paused": false,
                            "server": server.id,
                            "channel": channel.id,
                            "boundChannel": channel.id,
                            "defaultChannel": usr.voiceChannel.id,
                            "voice": usr.voiceChannel.id,
                            "Role": "@everyone",
                            "autoJoin": true,
                            "autoStart": true,
                            "volume": .1,
                            "prevMsg": null,
                            "tracks": []
                        };
                        if (!fs.existsSync("./playlists/" + server.id + "/" + server.id + ".json")) {
                            lib.writeJSON("./playlists/" + server.id + "/" + server.id + ".json", defaultJSON);
                        }
                        bot.sendMessage(channel, "now connected to: " + usr.voiceChannel.name);

                    } catch (err) {
                        console.log(err);
                    }
                } else {
                    var Guild = lib.openJSON('./playlists/' + server.id + '/' + server.id + '.json');
                    bot.joinVoiceChannel(usr.voiceChannel, (error, connection) => {
                        if (error != null) console.log(err);
                        mpegPlayer[server.id] = new iPod(bot, connection, channel, Guild);
                    });
                    bot.sendMessage(channel, "now connected to: " + usr.voiceChannel.name);
                }
            }
        }
    }
}

class getSong {
    constructor(plugin) {
        this.plugin = plugin;
        this.id = "request";
        this.names = ["request", "soundcloud", "add", "youtube", "yt", "sc"]
        this.role = "@everyone"
        this.func = function(bot, message, author, channel, server) {
            var args = message.content.split(" ");
            var toUpdate;
            var added = 0;
            if (lib.SCRegex.test(args[1])) {
                bot.sendMessage(channel, "Adding to playlist", (error, msg) => {
                    toUpdate = msg;
                });
                var newSong = {};
                try {
                    request("http://api.soundcloud.com/resolve.json?url=" + args[1] + "&client_id=3b16b5507608db3eaace81f41aea90bb", (error, response, body) => {
                        var songs = lib.openJSON('./playlists/' + server.id + '/' + server.id + '.json');
                        if (response.statusCode != 200 || error != null) {
                            bot.sendMessage(channel, "I cannot stream this song, Either is doesn't exist, or I do not have permission to stream it")
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
                                        "duration": body.duration,
                                        "type": "soundcloud"
                                    };
                                    added++;
                                    songs.tracks[songs.tracks.length] = newSong;
                                }
                                if (body.kind == "playlist") {
                                    for (var i = 0; i < body.tracks.length; i++) {
                                        newSong = {
                                            "id": body.tracks[i].id,
                                            "title": body.tracks[i].title,
                                            "user": author.id,
                                            "duration": body.tracks[i].duration,
                                            "type": "soundcloud"
                                        };
                                        added++;
                                        songs = lib.openJSON('./playlists/' + server.id + '/' + server.id + '.json');
                                        songs.tracks[songs.tracks.length] = newSong;
                                        lib.writeJSON('./playlists/' + server.id + '/' + server.id + '.json', songs);
                                    }
                                }
                            } catch (err) {
                                message.reply("Umm that song didn't like me");
                                console.log(err);
                            }
                        }
                        lib.writeJSON('./playlists/' + server.id + '/' + server.id + '.json', songs);
                        songs = null;
                        bot.updateMessage(toUpdate, "Added " + added + " song(s) to the queue");
                    });
                } catch (err) {
                    console.log(err);
                }
            } else if (lib.YTRegex.test(args[1])) {
                console.log("got a youtube link");
                var songs = lib.openJSON('./playlists/' + server.id + '/' + server.id + '.json');
                bot.sendMessage(channel, "Adding to playlist", function(error, msg) {
                    toUpdate = msg;
                });
                ytdl.getInfo(args[1], ["--format=bestaudio"], function(error, info) {
                    if (error != null) {
                        console.log(error);
                        return;
                    }
                    newSong = {
                        "url": info.url,
                        "title": info.title,
                        "user": author.id,
                        "duration": 2000,
                        "type": "youtube"
                    };
                    songs = lib.openJSON('./playlists/' + server.id + '/' + server.id + '.json');
                    songs.tracks[songs.tracks.length] = newSong;
                    lib.writeJSON('./playlists/' + server.id + '/' + server.id + '.json', songs);
                    added++;
                    songs = null;
                    bot.updateMessage(toUpdate, "Added " + added + " song(s) to the queue");
                });
            } else if (lib.YTPlaylistRegex.test(args[1])) {
                console.log("got a youtube link");
                var songs = lib.openJSON('./playlists/' + server.id + '/' + server.id + '.json');
                bot.sendMessage(channel, "Adding to playlist", function(error, msg) {
                    toUpdate = msg;
                });
                ytdl.getInfo(args[1], ["--format=bestaudio"], function(error, info) {
                    if (error != null) {
                        console.log(error);
                        return;
                    }
                    for (var track in info) {
                        newSong = {
                            "url": info[track].url,
                            "title": info[track].title,
                            "user": author.id,
                            "duration": 2000,
                            "type": "youtube"
                        };
                        added++;
                        songs = lib.openJSON('./playlists/' + server.id + '/' + server.id + '.json');
                        songs.tracks[songs.tracks.length] = newSong;
                        lib.writeJSON('./playlists/' + server.id + '/' + server.id + '.json', songs);
                    }
                    lib.writeJSON('./playlists/' + server.id + '/' + server.id + '.json', songs);
                    songs = null;
                    bot.updateMessage(toUpdate, "Added " + added + " song(s) to the queue");
                });
            }
        }
    }
}
class destroy {
    constructor(plugin) {
        this.plugin = plugin
        this.id = "destroy";
        this.names = ["destroy", "leave"];
        this.role = "@everyone"
        this.func = function(bot, msg, usr, channel, server) {
            if (mpegPlayer.hasOwnProperty(msg.channel.server.id)) {
                try {
                    if (mpegPlayer[server.id])
                        mpegPlayer[server.id].destroy();
                    delete mpegPlayer[server.id];
                } catch (err) {
                    msg.reply("Holy shit Batman!! Something went wrong! Heres the log: ```js\n" + err + "```");
                    console.log(err);
                }
            }
        }
    }
}
class play {
    constructor(plugin) {
        this.plugin = plugin;
        this.id = "play"
        this.names = ["play", "startmusic", "resume"];
        this.role = "@everyone"
        this.func = function(bot, msg, usr, channel, server) {
            if (mpegPlayer.hasOwnProperty(server.id)) {
                try {
                    playMusic(server);
                } catch (err) {
                    console.log(err);
                }
            } else {
                msg.reply("not in a voice channel");
            }
        }
    }
}

class queueMsg {

    constructor(plugin) {
        this.plugin = plugin
        this.id = "playlist";
        this.names = ["browser", "queue", "playlist", "pl"];
        this.role = "@everyone"
        this.func = function(bot, msg, usr) {
            var queue = ["Current Playlist:\n\n"];
            try {
                var songs = lib.openJSON('./playlists/' + msg.channel.server.id + '/' + msg.channel.server.id + '.json');
                var queueWord = queue;
                var n = 0;
                var tracks = songs.tracks;
                if (songs.tracks.length > 20) {
                    n = 20;
                } else {
                    n = songs.tracks.length;
                }

                for (var i = 0; i < n; i++) {
                    if ((queueWord + "**" + (i + 1) + "**:  `" + tracks[i].title.toString() + "`, <@" + tracks[i].user.toString() + ">").length <= 2000 && i < tracks.length) {
                        queue.push(("**" + (i + 1) + "**:  `" + tracks[i].title.toString() + "`, <@" + tracks[i].user.toString() + ">"));
                        queueWord = queue;
                    } else {
                        break;
                    }
                }
                queue.push("\n\nPlaylist total length: " + songs.tracks.length);
                queueWord = queue;
                bot.startTyping(msg.channel);
                setTimeout(function() {
                    bot.stopTyping(msg.channel);
                    bot.sendMessage(msg.channel, queueWord, function(error, message) {
                        bot.deleteMessage(message, {
                            wait: 17000
                        });
                    });
                }, 750);
                songs = null;
            } catch (err) {
                console.log(err);
            }
        }
    }
}

var help = function(bot, msg, usr, channel, server) {
    var helpMSG = [];
    var Args = msg.content.split(' ');
    if (Args.length == 1) {
        helpMSG.push("**~Plugins~**\nType ##help <plugin> to view the commands for the plugin");
        for (var plugin in cmdReg.cmds) {
            helpMSG.push("`" + plugin + "`");
        }
        bot.sendMessage(channel, helpMSG);
    } else {
        if (cmdReg.cmds.hasOwnProperty(Args[1])) {
            helpMSG.push("**~Show Commands For " + Args[1] + "~**")
            for (var cmd in cmdReg.cmds[Args[1]]) {
                var prefix = cmdReg.prefixes[Args[1]].prefixes;
                helpMSG.push("`" + prefix + cmd + "` : **" + cmdReg.cmds[Args[1]][cmd].desc + "** Aliases: " + cmdReg.cmds[Args[1]][cmd].name.join(", "));
            }
        }
        bot.sendMessage(channel, helpMSG);
    }
}

class skip {
    constructor(plugin) {
        this.plugin = plugin
        this.id = "skip";
        this.names = ["skip", "next", "newsong", "playnext"]
        this.role = "@everyone"
        this.func = function(bot, msg, usr, channel, server) {

            if (!mpegPlayer.hasOwnProperty(server.id)) return;

            if (!checkUser(usr, server)) return;

            msg.reply("skipping");
            playNext(server);
        }
    }
}

class pause {

    constructor(plugin) {
        this.plugin = plugin
        this.id = "pause"
        this.names = ["pause", "stop", "stopmusic"]
        this.role = "@everyone"
        this.func = function(bot, msg, author, channel, srv) {
            if (mpegPlayer.hasOwnProperty(srv.id)) {
                var Guild = lib.openJSON(mpegPlayer[srv.id].plFile);
                Guild.paused = true;
                mpegPlayer[srv.id].paused = true;
                mpegPlayer[srv.id].playing = false;
                mpegPlayer[srv.id].currentTime += (mpegPlayer[srv.id].voiceConnection.streamTime / 1000);
                mpegPlayer[srv.id].currentStream = false;
                mpegPlayer[srv.id].voiceConnection.stopPlaying();
            }
        }
    }
}
class shuffle {
    constructor(plugin) {
        this.plugin = plugin
        this.id = "shuffle"
        this.names = ["shuffle", "randomize"]
        this.role = "@everyone"
        this.func = function(bot, msg, usr, channel, server) {
            if (mpegPlayer.hasOwnProperty(server.id)) {
                var songs = lib.openJSON(mpegPlayer[server.id].plFile);

                var playlist = songs.tracks;

                for (var i = playlist.length - 1; i > 1; i--) {
                    var n = Math.floor(Math.random() * (i + 1));
                    if (n != 0) {
                        var temp = playlist[i];
                        playlist[i] = playlist[n];
                        playlist[n] = temp;
                    } else {
                        i++;
                    }
                }

                songs.tracks = playlist;

                bot.sendMessage(channel, "**Shuffle :diamonds: Shuffle :spades: Shuffle :hearts:**", function(error, message) {
                    if (error) {
                        console.log(error);
                    }
                    bot.deleteMessage(message, {
                        wait: 7000
                    });
                });
                lib.writeJSON(mpegPlayer[server.id].plFile, songs);
                songs = null;
            }
        }
    }
}
class clearplaylist {
    constructor(plugin) {
        this.plugin = plugin
        this.id = "clearplaylist"
        this.names = ["cpl", "clearplaylist", "clearpl", "playlistclear"]
        this.role = "@everyone"
        this.func = function(bot, msg, usr, channel, server) {
            if (mpegPlayer.hasOwnProperty(server.id)) {
                try {
                    var songs = lib.openJSON(mpegPlayer[server.id].plFile);
                    songs.tracks = [];
                    mpegPlayer[server.id].voiceConnection.stopPlaying();
                    lib.writeJSON(mpegPlayer[server.id].plFile, songs);
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
}




var setRole = function(bot, message, author, channel, server) {
    var Args = message.content.split(" ");
    if (Args.length >= 2) {
        if (mpegPlayer.hasOwnProperty(server.id)) {
            var guild = mpegPlayer[server.id];
            var Guild = openJSON(mpegPlayer[server.id].plFile)
            if (lib.isRole(message, author, guild.Role) || server.owner.equals(author) || lib.hasPerms(author, server, "manageServer")) {
                guild.Role = Args[1];
                Guild.Role = guild.Role;
            } else {
                bot.sendMessage(channel, "You don't have permission to change this setting");
            }
        }
    } else {
        bot.sendMessage(channel, "invalid argument count");
    }
}

var setJoin = function(bot, message, author, channel, server) {

}


class config {
    constructor(plugin) {
        this.plugin = plugin
        this.id = "config"
        this.role = "@everyone"
        this.names = ["config", "configure"]
        this.func = function(bot, message, author, channel, server) {

            var Args = message.content.split(" ");

            if (Args.length < 2) return;

            var configs = {
                role: setRole,
                autojoin: setJoin
            }

            if (configs.hasOwnProperty(Args[1].toLowerCase())) {
                message.content = Args.splice(0, 1).join(" ");
                configs[Args[1]](bot, message, author, channel, server);
            }


        }
    }
}


function startUp(bot, index) {

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

        lib.writeJSON("./playlists/" + dir[index] + "/" + current[0], Guild);

        if (Guild.autoJoin == true && Guild.defaultChannel != null) {
            bot.joinVoiceChannel(bot.channels.get("id", Guild.defaultChannel), function(error, connection) {
                if (error != null) console.log(err);

                mpegPlayer[Guild.server] = new iPod(bot, connection, bot.channels.get("id", Guild.boundChannel), Guild);

                if (mpegPlayer[Guild.server].autoStart == true && Guild.tracks.length > 0 && connection.voiceChannel.members.length > 0 && !mpegPlayer[Guild.server].paused)
                    playMusic(bot.servers.get("id", Guild.server));
                startUp(bot, index + 1);
            });
        }
    }
}

module.exports = class commands {
    constructor(plugin) {
        if (plugin != null) {
            this.plugin = plugin;
        }
    }

    register(CommandRegistry) {
        CommandRegistry.registerPrefix(this.plugin, "#$");
        CommandRegistry.registerCommand(new volume(this.plugin))
        CommandRegistry.registerCommand(new summon(this.plugin))
        CommandRegistry.registerCommand(new destroy(this.plugin))
        CommandRegistry.registerCommand(new getSong(this.plugin))
        CommandRegistry.registerCommand(new play(this.plugin))
        CommandRegistry.registerCommand(new queueMsg(this.plugin))
        CommandRegistry.registerCommand(new pause(this.plugin))
        CommandRegistry.registerCommand(new shuffle(this.plugin))
        CommandRegistry.registerCommand(new skip(this.plugin))
        CommandRegistry.registerCommand(new clearplaylist(this.plugin))
        CommandRegistry.registerCommand(new config(this.plugin))
        startUp(this.plugin.bot, 0);
    }
}
