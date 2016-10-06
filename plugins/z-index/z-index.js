"use strict";

var DiscordJS = require('discord.js');
var Plugin = require('../../lib/registry/models/plugin');
var commands = require('./lib/commands');

class zIndex extends Plugin {

    constructor(bot, plugin, registry) {
        super(plugin.name);
        this.plugin = plugin
        this.id = plugin.id;
        this.name = plugin.name;
        this.author = plugin.author;
        this.version = plugin.version;
        if (bot instanceof DiscordJS.Client) {
            this.bot = bot;

        } else {
            console.log("Provided bot is not istance of Discord.js Bot");
        }

        this.loaded = false;
    }

    loadPlugin() {
        if (!this.loaded) {
            commands = new commands(this.plugin);
            commands.register(this.registry);
            this.loaded = true;
        }
    }
}

var plugin = {
    name: "Help",
    id: "help",
    author: "R3alCl0ud",
    version: "1.0.0"
}


// module.exports = function(bot, registry) {
    // return new zIndex(bot, plugin, registry);
// };
