"use strict";

var DiscordJS = require('discord.js');
var lib = require('../../../lib');

class kernal {
    constructor(bot, voiceConnection) {
        this.bot = bot;
        this.voiceConnection = voiceConnection;
        this.voiceChannel = voiceConnection.voiceChannel;
        this.server = voiceConnection.server;
        this.np = {};
        this.currentTime = 0;
        this.volume = 0;
        this.currentStream = false;
    }

    play() {
        var playlist = lib.openJSON('/playlists/' + this.server.id + '/' + this.server.id + '.json');
        var song = playlist.tracks[0];
        if (song.type == "soundcloud") {
            this.currentStream = request("http://api.soundcloud.com/tracks/" + song.id + "/stream?client_id=" + this.keys.soundcloud);
            try {
                this.voiceConnection.playRawStream(currentStream, {seek: this.currentTime, volume: this.volume}, function(intent) {
                    intent.on("end", playNext);
                });
            } catch (err) {
                console.log(err);
            }
        } else if (song.type == "youtube") {
            this.voiceConnection.playFile('./playlists/' + this.server + '/' + song.id + '.mp3', {seek: this.currentTime, volume: this.volume}, function (intent) {
                intent.on("end", playNext);
            });
        }
    }

    playNext() {
        lib.openJSON('/playlists/' + this.server.id + '/' + this.server.id + '.json');
        this.currentTime = 0;
    }

    songEnd() {

    }

    leave() {
        this.voiceConnection.destory();
    }

    setVolume(volume) {
        lib.openJSON('/playlists/' + this.server.id + '/' + this.server.id + '.json');
        this.volume = volume;
    }

    pauseSong() {
        console.log(this.voiceConnection.streamTime)
        this.currentTime = this.voiceConnection.streamTime;
    }

}
