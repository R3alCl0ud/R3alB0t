"use strict";

/**
 *  This is the chat handling class file. This is the command running code. Very finiky
 *
 */
class chatHandler {

    constructor(bot) {
        this.bot = bot;
        this.commands = {};
        this.prefixes = [];
        for (var plugin in bot.registry.cmds) {
            if (!this.commands.hasOwnProperty(plugin)) {
                this.commands[plugin] = {};
            }
            for (var cmd in bot.registry.cmds[plugin]) {
                this.commands[plugin][cmd] = bot.registry.cmds[plugin][cmd];
            }
        }
        for (var plugin in bot.registry.prefixes) {
            var prefix = bot.registry.prefixes[plugin].prefixes;
            this.prefixes[this.prefixes.length] = prefix;
        }
        this.prefixes[this.prefixes.length] = "##";
        this.commands["registery"] = {};
        //this.
    }

    register() {

    }

    destroy() {

    }

    addPrefix(prefix) {
        this.prefixes.push(prefix);
    }

    setCommandRole(cmd, role) {
        if (cmd == null) return false;
        this.commands[cmd].role = role;
        return true;
    }

    addCommand(id, names, desc, cmd, Role) {
        this.commands[id] = {
            name: names,
            desc: desc,
            func: cmd,
            role: Role
        }
    }

    addCommandHandler() {


        return function(message, author, channel, server) {
            var cmdArgs = message.content.toLowerCase().split(' ');
            var prefixed = false;



            if (author.bot) return false;

            for (var i = 0; i < this.prefixes.length; i++) {
                var prefix = this.prefixes[i];
                if (cmdArgs[0].substring(0, prefix.length) == prefix) {
                    cmdArgs[0] = cmdArgs[0].substring(prefix.length);
                    prefixed = true;
                    break;
                }
            }
            if (prefixed) {
                for (var plugin in this.commands) {
                    for (var cmd in this.commands[plugin]) {
                        var command = this.commands[plugin][cmd];
                        if (command === undefined) continue;
                        if (command.name.indexOf(cmdArgs[0]) == -1) continue;

                        var hasRole = false;

                        var authorRoles = server.rolesOf(author);
                        for (var role in authorRoles) {
                            if (authorRoles[role].name == command.role.toString())
                            {
                                hasRole = true;
                                break;
                            }
                        }

                        try {
                            console.log("command: " + cmdArgs[0] + " used by: " + author.username);
                            if (hasRole || command.role == "@everyone") {

                                command.func(this.bot, message, author, channel, server);
                            } else {
                                message.reply("You don't have permission to use this command, You must be in the role `" + command.role + "` to use this command");
                            }
                        } catch (err) {
                            console.log(err);
                        }
                        return;
                    }
                }
            }
        }.bind(this);
    }
}

module.exports = chatHandler;
