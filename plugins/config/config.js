"use strict";

var DiscordJS = require('discord.js');
var Plugin = require('../../lib/registry/models/plugin');

class config extends Plugin {
    constructor(bot) {
        super("Config");
        this.id = "config";
        this.name = "Config";
        this.Author = "R3alCl0ud"
        if (bot instanceof DiscordJS.Client) {
            this.bot = bot;
        }
    }

    loadPlugin() {
        if (!this.loaded) {
            this.loaded = true;
        }
    }
}

module.exports = function(bot, registry) {
    return new config(bot);
};
