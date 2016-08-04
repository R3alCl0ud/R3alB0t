"use strict";

var DiscordJS = require("discord.js")
    /**
     *  This is the chat handling class file. This is the command running code. Very finiky
     *
     */
class chatHandler {

    constructor(bot) {
        this.bot = bot;
        this.commands = bot.registry.plugins;
        this.commands["registery"] = {
            prefixes: new DiscordJS.Cache()
        };
        this.commands.registery.prefixes.add({
            prefix: "##",
            server: "Global"
        })
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
            //console.log(message.content);
            var prefixed = false;

            if (author.bot) return false;


            for (var plugin in this.commands) {

                var guild = this.commands[plugin].prefixes.get("server", server.id);

                if (guild == null) {
                    guild = this.commands[plugin].prefixes.get("server", "Global");
                }

                if (cmdArgs[0].substring(0, guild.prefix.length) != guild.prefix) {
                    continue;
                }

                cmdArgs[0] = cmdArgs[0].substring(guild.prefix.length);

                for (var cmd in this.commands[plugin].cmds) {
                    var command = this.commands[plugin].cmds[cmd];
                    if (command === undefined) continue;
                    if (command.names.indexOf(cmdArgs[0]) == -1) continue;

                    var hasRole = false;

                    var authorRoles = server.rolesOf(author);
                    for (var role in authorRoles) {
                        if (authorRoles[role].name == command.role.toString()) {
                            hasRole = true;
                            break;
                        }
                    }

                    try {
                        console.log("command: " + cmd + " used by: " + author.username);
                        if (hasRole || command.role == "@everyone") {
                            command.func(this.bot, message, author, channel, server, this.commands);
                            break;
                        } else {
                            message.reply("You don't have permission to use this command, You must be in the role `" + command.role + "` to use this command");
                            break;
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
                cmdArgs[0] = guild.prefix + cmdArgs[0];
            }
        }.bind(this);
    }
}


module.exports = chatHandler;
