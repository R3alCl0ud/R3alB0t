const DiscordJS = require('discord.js');
const Plugin = require('../../lib/registry/models/plugin');
let commands = require('./lib/commands');

class wagYourCommands extends Plugin {

    constructor(guilds, channels, users) {
        super(plugin.id, plugin.name, plugin.author, plugin.version, "LewdPL");
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

var plugin = {
    name: "LewdPL",
    id: "LewdPL",
    author: "wagyourtail",
    version: "0.0.0"
}


module.exports = wagYourCommands;
