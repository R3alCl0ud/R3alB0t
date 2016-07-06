"use strict";

var DiscordJS = require('discord.js');
var Plugin = require('../../lib/registry/models/Plugin');
var commands = require('./lib/commands');

class examplePlugin extends Plugin {

    constructor(bot, plugin, registry) {
        super(plugin.name);
        this.id = plugin.id;
        this.name = plugin.name;
        this.author = plugin.author;
        this.registry = registry;
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
            commands.registerCMD(this.registry, this);
            this.loaded = true;
        }
    }
}

var plugin = {
    name: "Example Plugin",
    id: "exampleplugin",
    author: "R3alCl0ud & ZachAttack101",
    version: "1.1.0"
}


module.exports = function(bot, registry) {
    return new examplePlugin(bot, plugin, registry);
};
