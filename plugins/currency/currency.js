var DiscordJS = require('discord.js');
var Plugin = require('../../lib/registry/models/plugin');
var commands = require('./lib/commands');

class currency extends Plugin {

    constructor(guilds, channels, users) {
        super(plugin.id, plugin.name, plugin.author, plugin.version, "Currency Plugin");
        this.guilds = guilds;
        this.channels = channels;
        this.users = users;
        
        this.loaded = false;
        
        this.on('load', this.loadPlugin.bind(this));
        
    }

    loadPlugin() {
        if (!this.loaded) {
            commands = new commands(this)
            commands.register();
            this.loaded = true;
        }
    }
}

var plugin = {
    name: "Currency",
    id: "currency",
    author: "R3alCl0ud",
    version: "0.0.1"
}


module.exports = currency;