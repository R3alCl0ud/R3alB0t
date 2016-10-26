const DiscordJS = require('discord.js');
const Plugin = require('../../lib').Plugin;
var commands = require('./lib/commands');

class musicPlayer extends Plugin {

    constructor(guilds, channels, users) {
        super(plugin);
        this.guilds = guilds;
        this.users = users;
        this.channels = channels;
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
    name: "Music Player",
    id: "music",
    author: "R3alCl0ud",
    version: "1.0.1"
}


module.exports = musicPlayer;

