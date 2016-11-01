const Plugin = require('DiscordForge').Plugin;
let commands = require('./lib/commands');

class currency extends Plugin {

    constructor() {
        super(plugin.id, plugin.name, plugin.author, plugin.version, "Currency Plugin");

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
