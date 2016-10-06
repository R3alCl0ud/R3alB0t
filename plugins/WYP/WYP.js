"use strict";

var DiscordJS = require('discord.js');
var Plugin = require('../../lib/registry/models/plugin');
var commands = require('./lib/commands');

class wagYourCommands extends Plugin {

    constructor(bot, plugin, registry) {
        super(plugin.name);
        this.id = plugin.id;
        this.name = plugin.name;
        this.author = plugin.author;
        this.registry = registry;
        this.version = plugin.version;
        this.plugin = plugin
        if (bot instanceof DiscordJS.Client) {
            this.bot = bot;

        } else {
            console.log("Provided bot is not istance of Discord.js Bot");
        }
        this.loaded = false;
    }



    loadPlugin() {
        if (!this.loaded) {
            commands = new commands(this.plugin)
            commands.register(this.registry)
            this.loaded = true;
        }
    }
}

var plugin = {
    name: "wagyourplugin",
    id: "WYP",
    author: "wagyourtail",
    version: "0.0.0"
}


module.exports = function(bot, registry) {
    return new wagYourCommands(bot, plugin, registry);
};
