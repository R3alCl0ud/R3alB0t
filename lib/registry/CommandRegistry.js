"use strict";
var DiscordJS = require('discord.js');
/**
 * Create a new instance of the command registry for every instance of the bot
 *
 *
 */
class CommandRegistry {

    /**
     *
     *
     */

    constructor() {
        this.plugins = {};
    }

    registerCommand(command) {

        if (!this.plugins.hasOwnProperty(command.plugin.id)) {
            this.plugins[command.plugin.id] = {
                cmds: {},
                prefixes: new DiscordJS.Cache()
            };
        }

        if (command.names == null) command.names = ["undefined"]

        for (var name in command.names) {
            command.names[name] = command.names[name].toLowerCase() || "undefined";
        }



        command.func = command.func || function() {
            return;
        };
        command.role = command.role || "@everyone";
        command.desc = command.desc || "No description provided";

        this.plugins[command.plugin.id].cmds[command.id] = {
            func: command.func,
            names: command.names,
            desc: command.desc,
            role: command.role
        };
    }

    registerPrefix(plugin, Prefix, server) {
        if (!this.plugins.hasOwnProperty(plugin.id))
            this.plugins[plugin.id] = {
                cmds: {},
                prefixes: new DiscordJS.Cache()
            };

        this.

        else
        var guild = null;
        if (server == null)
            guild = "Global";
        else
            guild = server.id

        this.plugins[plugin.id].prefixes.add({
            prefix: Prefix,
            server: guild
        });


    }

    reloadPlugin(plugin) {

    }
}

module.exports = CommandRegistry;
