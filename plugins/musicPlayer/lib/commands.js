"use strict";
var lib = require("../../../lib");
var fs = require('fs');
var request = require('request');
var ytdl = require('youtube-dl');
var mpegPlayer = {};
var cmdReg;

class iPod {
    constructor(bot, voiceConnection, channel) {
        this.bot = bot;
        this.voiceConnection = voiceConnection;
        this.voiceChannel = voiceConnection.voiceChannel;
        this.server = voiceConnection.server;
        this.boundChannel = channel;
        this.np = {};
        this.paused = false;
        this.playing = false;
        this.ending = false;
        this.plFile = './playlists/' + this.server.id + '/' + this.server.id + '.json';
        this.currentTime = 0;
        this.volume = 0.1;
        this.currentStream = false;
        this.keys = {
            soundcloud: "3b16b5507608db3eaace81f41aea90bb"
        };
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
    playMusic(srv);
}


function playMusic(srv) {
    var playlist = lib.openJSON(mpegPlayer[srv.id].plFile);
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
                mpegPlayer[srv.id].bot.sendMessage(mpegPlayer[srv.id].boundChannel, "**Now Playing: " + song.title + "**", function(error, message) {
                    mpegPlayer[srv.id].np = message.id;
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
                mpegPlayer[srv.id].bot.sendMessage(mpegPlayer[srv.id].boundChannel, "**Now Playing: " + song.title + "**", function(error, message) {
                    mpegPlayer[srv.id].np = message.id;
                });
            } catch (err) {
                console.log(err);
            }
        }
        mpegPlayer[srv.id].currentStream.on('end', function() {
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

var volume = function(bot, msg, usr) {
    if (mpegPlayer.hasOwnProperty(msg.channel.server.id)) {
        var volume = (msg.content.split(" ").slice(1).join(" ") / 100);
        if (Math.abs(volume) <= 2) {
            mpegPlayer[msg.channel.server.id].volume = volume;
            bot.sendMessage(mpegPlayer[msg.channel.server.id].boundChannel, "Volume set to: `" + (volume * 100) + "%`");
            mpegPlayer[msg.channel.server.id].voiceConnection.setVolume(volume);
        } else {
            msg.reply("please use a more reasonable volume!");
        }
    }
}

var summon = function(bot, msg, usr, channel, server) {
    if (!mpegPlayer.hasOwnProperty(server.id)) {
        if (usr.voiceChannel != null) {
            try {
                bot.joinVoiceChannel(usr.voiceChannel, function(error, connection) {
                    if (error != null) console.log(err);
                    mpegPlayer[server.id] = new iPod(bot, connection, channel);
                });
                var defaultJSON = {
                    "current": 0,
                    "start": 0,
                    "paused": false,
                    "server": msg.channel.server.id,
                    "channel": msg.channel.id,
                    "voice": msg.author.voiceChannel.id,
                    "volume": .05,
                    "prevMsg": null,
                    "tracks": []
                };
                if (!fs.existsSync("./playlists/" + server.id + "/")) {
                    fs.mkdirSync("./playlists/" + server.id + "/");
                }
                if (!fs.existsSync("./playlists/" + server.id + "/" + msg.channel.server.id + ".json")) {
                    lib.writeJSON("./playlists/" + server.id + "/" + server.id + ".json", defaultJSON);
                }
                bot.sendMessage(msg.channel, "now connected to: " + usr.voiceChannel.name);

            } catch (err) {
                console.log(err);
            }
        }
    } else {
        msg.reply("Already in a voice channel on this server");
    }
}

var getSong = function(bot, message, author, channel, server) {
    var args = message.content.split(" ");
    var toUpdate;
    var added = 0;
    if (lib.SCRegex.test(args[1])) {
        bot.sendMessage(channel, "Adding to playlist", function(error, msg) {
            toUpdate = msg;
        });
        var newSong = {};
        try {
            request("http://api.soundcloud.com/resolve.json?url=" + args[1] + "&client_id=3b16b5507608db3eaace81f41aea90bb", function(error, response, body) {
                var songs = lib.openJSON('./playlists/' + server.id + '/' + server.id + '.json');
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
                                songs.tracks[songs.tracks.length] = newSong;
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
                songs.tracks[songs.tracks.length] = newSong;
            }
            lib.writeJSON('./playlists/' + server.id + '/' + server.id + '.json', songs);
            songs = null;
            bot.updateMessage(toUpdate, "Added " + added + " song(s) to the queue");
        });
    }
}


var destroy = function(bot, msg, usr) {
    if (mpegPlayer.hasOwnProperty(msg.channel.server.id)) {
        try {
            mpegPlayer[msg.channel.server.id].destroy();
            delete mpegPlayer[msg.channel.server.id];
        } catch (err) {
            msg.reply("Holy shit Batman!! Something went wrong! Heres the log: ```js\n" + err + "```");
            console.log(err);
        }
    }
}

var play = function(bot, msg, usr) {
    if (mpegPlayer.hasOwnProperty(msg.channel.server.id)) {
        try {
            playMusic(msg.channel.server);
        } catch (err) {
            console.log(err);
        }
    } else {
        msg.reply("not in a voice channel");
    }
}

function queueMsg(bot, msg, usr) {
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

var skip = function(bot, msg, usr, channel, server) {
    if (mpegPlayer.hasOwnProperty(server.id)) {
        msg.reply("skipping");
        playNext(server);
    }
}

var pause = function(bot, msg, author, channel, srv) {
    if (mpegPlayer.hasOwnProperty(srv.id)) {
        mpegPlayer[srv.id].currentTime += (mpegPlayer[srv.id].voiceConnection.streamTime / 1000);
        mpegPlayer[srv.id].currentStream = false;
        mpegPlayer[srv.id].voiceConnection.stopPlaying();
    }
}

var shuffle = function(bot, msg, usr, channel, server) {
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
var clearplaylist = function(bot, msg, usr, channel, server) {
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


exports.registerCMD = function(CommandRegistry, plugin) {
    cmdReg = CommandRegistry;
    CommandRegistry.registerPrefix(plugin, "##");
    CommandRegistry.registerCommand(plugin, "clearplaylist", ["cpl", "clearplaylist", "clearpl", "playlistclear"], "Stops the music and clears the playlist", clearplaylist, "DJ");
    CommandRegistry.registerCommand(plugin, "leave", ["destroy", "leave", "goaway"], "Makes the bot leave the voice channel", destroy, "DJ");
    CommandRegistry.registerCommand(plugin, "pause", ["pause"], "Pauses the music", pause, "DJ");
    CommandRegistry.registerCommand(plugin, "play", ["play", "startmusic"], "Starts the music", play, "DJ");
    CommandRegistry.registerCommand(plugin, "queue", ["browser", "queue", "playlist", "pl"], "Shows the servers playlist", queueMsg, "@everyone");
    CommandRegistry.registerCommand(plugin, "request", ["request", "add", "soundcloud", "sc", "youtube", "yt"], "Adds a song to the playlist", getSong, "@everyone");
    CommandRegistry.registerCommand(plugin, "shuffle", ["shuffle", "randomize"], "Shuffles the playlist", shuffle, "DJ");
    CommandRegistry.registerCommand(plugin, "skip", ["skip", "next", "newsong", "playnext"], "Skips the music", skip, "DJ");
    CommandRegistry.registerCommand(plugin, "summon", ["summon", "join", "comehere"], "Joins your voice channel", summon, "DJ");
    CommandRegistry.registerCommand(plugin, "volume", ["volume", "loudness", "vol", "setvol", "setvolume"], "Sets the volume", volume, "DJ");
}
