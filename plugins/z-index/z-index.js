"use strict";

var DiscordJS = require('discord.js');
var Plugin = require('../../lib/registry/models/plugin');
var commands = require('./lib/commands');

class zIndex extends Plugin {

    constructor(guilds, channels, users) {
        super(plugin.id, plugin.name, plugin.author, plugin.version, "Informationz");
        this.guilds = guilds;
        this.channels = channels;
        this.users = users;
        this.loaded = false;
        this.on('load', this.loadPlugin.bind(this));
    }

    loadPlugin() {
        if (!this.loaded) {
            commands = new commands(this);
            commands.register();
            this.loaded = true;
        }
    }
}

const plugin = {
    name: "Help",
    id: "help",
    author: "R3alCl0ud",
    version: "1.0.0"
}


// module.exports = function(bot, registry) {
    // return new zIndex(bot, plugin, registry);
// };
module.exports = zIndex;