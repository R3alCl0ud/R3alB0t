const Plugin = require('DiscordForge').Plugin;
const commands = require('./lib/commands');

class musicPlayer extends Plugin {

    constructor() {
        super(plugin);
        this.on('load', this.loadPlugin.bind(this));
    }



    loadPlugin(client) {
        if (!this.loaded) {
            this.commandLoader = new commands(this);
            this.commandLoader.register(client);
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
