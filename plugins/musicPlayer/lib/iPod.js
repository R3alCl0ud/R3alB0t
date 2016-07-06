"use strict";

var DiscordJS = require('discord.js');
var EventEmitter = require('events').EventEmitter;
var botKernal = require('./botKernal');

class iPod extends EventEmitter {

    constructor(bot, voiceConnection) {
        super();
        this.bot = bot;
        this.mpPlayer = new botKernal(bot, voiceConnection);
    }

    destroy() {
        this.mpPlayer.leave();
    }

    play(song) {
        this.mpPlayer.play();
    }

    skip() {
        this.mpPlayer.skip();
    }

    addToPlaylist(song) {
        this.mpPlayer.addSong();
    }

    get playing() {
        return this.mpPlayer.song;
    }

    get bot() {
        return this.mpPlayer.bot;
    }

    get playlist() {
        return this.mpPlayer.playlist();
    }

    get voiceConnection() {
        return this.mpPlayer.voiceConnection;
    }

    get keys() {
        return this.mpPlayer.keys;
    }
}

module.exports = iPod;
