"use strict";

var DiscordJS = require('discord.js');
var lib = require('..');

class kernal {
    constructor(bot, voiceConnection, mpegPlayer, Keys) {
        this.bot = bot;
        this.voiceConnection = voiceConnection;
        this.server = voiceConnection.server;
        this.currentTime = 0;
        this.mpegPlayer = mpegPlayer;
        this.keys = Keys;
        this.currentStream = false;
    }

    playSong(song) {
        if (song.type == "soundcloud") {
            this.currentStream = request("http://api.soundcloud.com/tracks/" + song.id + "/stream?client_id=" + this.keys.soundcloud);
        } else if (song.type == "youtube") {
            this.voiceConnection.playFile('./playlists/' + this.server + '/' + song.id + '.mp3');
        }

        try {
            this.voiceConnection.play
        }

    }

    stopSong() {
        console.log(this.voiceConnection.streamTime)
        this.currentTime = this.voiceConnection.streamTime;
    }

}
