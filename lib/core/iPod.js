"use strict";

var DiscordJS = require('discord.js');
var EventEmitter = require('events').EventEmitter;
var botKernal = require('botKernal');

class iPod extends EventEmitter {

    constructor(bot, voiceConnection) {
        super();
        this.CommandRegistry = CommandRegistry;
        this.mpPlayer = new botKernal(bot, voiceConnection);
    }

    destroy() {

    }

    play(song) {
        this.mpPlayer.play(song);
    }

    skip() {
        this.mpPlayer.skip();
    }

    addToPlaylist(song) {
        this.mpPlayer.addSong(song);
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

    get CommandRegistry() {
        return this.CommandRegistry;
    }

    get keys() {
        return this.mpPlayer.keys;
    }
}
