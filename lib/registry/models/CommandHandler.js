"use strict";
var DiscordJS = require("discord.js")
    /**
     *  This is the chat handling class file. This is the command running code. Very finiky
     *
     */
class chatHandler {

    constructor(client) {
        this.client = client;
    }

    register() {

    }

    destroy() {

    }

    addCommandHandler() {
        return function(message, author, channel, guild) {
            var cmdArgs = message.content.split(' ');

            if (author.bot) return false;

            if (guild != null) {
                console.log(`${author.username}: ${message.createdTimestamp}: ${channel.id}`)
                if (this.client.registry.guilds.has(guild.id)) {
                    const guild = this.client.registry.guilds.get(message.guild.id)

                    if (cmdArgs[0].substring(0, guild.prefix.length) != guild.prefix) {
                        return;
                    }
                    cmdArgs[0] = cmdArgs[0].substring(guild.prefix.length);
                    let plugins = [];
                    for (const plugin in guild.enabledPlugins) {
                        plugins.push(guild.enabledPlugins[plugin]);
                    }
                    for (const enabled in plugins) {
                        const plugin = this.client.registry.plugins.get(plugins[enabled])
                        if (typeof plugin !== "object") continue;
                        console.log("test")
                        if ((plugin.commands.has(cmdArgs[0]) || plugin.aliases.has(cmdArgs[0])) || ((plugin.commands.has(cmdArgs[0].toLowerCase()) && !plugin.commands.get(cmdArgs[0].toLowerCase()).caseSensitive) || (plugin.aliases.has(cmdArgs[0].toLowerCase()) && !plugin.commands.get(plugin.aliases.get(cmdArgs[0].toLowerCase())).caseSensitive))) {
                            console.log("Found the command");
                            const command = plugin.commands.get(cmdArgs[0]) || plugin.commands.get(plugin.aliases.get(cmdArgs[0])) || plugin.commands.get(cmdArgs[0].toLowerCase()) || plugin.commands.get(plugin.aliases.get(cmdArgs[0].toLowerCase()));
                            console.log(`plugin: ${plugins[enabled]}, command: ${command.id}, used by: ${author.username}`);
                            try {
                                if (typeof command.Message === 'function'){
                                    command.Message(message, author, channel, guild, this.client.guilds, this.client.channels, this.client.users, this.client.registry);
                                } else if (typeof command.Message === 'string') {
                                    channel.sendMessage(command.Message).catch(console.log);
                                }
                            } catch (error) {
                                console.log(error)
                            }
                        }
                    }
                }
            }
        }.bind(this);
    }
}


module.exports = chatHandler;
