"use strict";

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

        this.cmds = {};
        this.prefixes = {};
    }

    registerCommand(plugin, id, names, desc, func, roles) {
        var cmd = {
            name: names,
            desc: desc,
            func: func,
            role: roles
        }
        if (!this.cmds.hasOwnProperty(plugin.id)) {
            this.cmds[plugin.id] = {};
        }

        this.cmds[plugin.id][id] = cmd;
    }

    registerPrefix(plugin, Prefix) {
        var prefix = {
            plugin: plugin.id,
            prefixes: Prefix
        }
        if (!this.prefixes.hasOwnProperty(plugin.id)) {
            this.prefixes[plugin.id] = {};
        }
        if (!this.prefixes[plugin.id].hasOwnProperty())
            this.prefixes[plugin.id] = prefix;

    }
}

module.exports = CommandRegistry;
