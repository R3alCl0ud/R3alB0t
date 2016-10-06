"use strict";
var DiscordJS = require('discord.js');
var Guild = require('./models/guild');
var guildsFile = './data/guilds.json';
var Cache = require('./models/cache');
/**
 * This is the CommandRegistry holds all of the commands in the world
 *
 */
class CommandRegistry {

    constructor() {
        this.plugins = new DiscordJS.Collection();
        this.guilds = new DiscordJS.Collection();
    }

    registerGuild(guild) {
        if (guild !== null && guild instanceof DiscordJS.Guild) {
            this.guilds.set(guild.id, new Guild(guild))
        }
    }

    reloadPlugin(plugin) {

    }

    registerPlugin(plugin) {
        this.plugins.set(plugin.id, plugin);
    }
}

module.exports = CommandRegistry;
