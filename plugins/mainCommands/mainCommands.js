"use strict";

var DiscordJS = require('discord.js');
var Plugin = require('../../lib/registry/models/plugin');
// var chatHandler = require("./lib/chatHandler");
// var commands = require('./lib/commands');

class mainCommands extends Plugin {

    constructor(bot, plugin) {
        super(plugin.name);
        this.id = plugin.id;
        this.name = plugin.name;
        this.author = plugin.author;
        this.version = plugin.version;
        if (bot instanceof DiscordJS.Client) {
            this.bot = bot;
        } else {
            console.log("Provided client is not an instance of a discord.js Client");
        }

        this.loaded = false;
    }

    loadPlugin() {
        if (!this.loaded) {
            // commands.registerCMD(this);
            this.loaded = true;
        }
    }
}

var plugin = {
    name: "Main Commands",
    id: "maincommands",
    author: "R3alCl0ud & ZachAttack101",
    version: "1.1.0"
}


module.exports = function(bot) {
    return false;
    //return new mainCommands(bot, plugin);
};
