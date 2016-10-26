const Plugin = require('../../').Plugin;
const commands = require('./lib/commands');


class Config extends Plugin {
    constructor(client) {
        super("config", "Config", "R3alCl0ud", "v0.0.1");
        this.client = client;
        this.on('load', this.loadPlugin.bind(this));
    }

    loadPlugin() {
        if (!this.loaded) {
            this.loaded = true;
            this.register();
        }
    }

    register() {
        const config = new commands.config(this)
        this.registerCommand(config);
        config.registerSubCommand(new commands.prefix(config));
    }
}

module.exports = Config;
