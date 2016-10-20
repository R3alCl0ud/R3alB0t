const DiscordJS = require("discord.js")
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
            let cmdArgs = message.content.split(' ');
            
            if (author.bot) return;
            
            if (guild != null) {
                console.log(`${author.username}: ${message.createdTimestamp}: ${channel.id}`)
                if (this.client.registry.guilds.has(guild.id)) {
                    const guild = this.client.registry.guilds.get(message.guild.id)

                    if (cmdArgs[0].substring(0, guild.prefix.length) != guild.prefix) return;
                    cmdArgs[0] = cmdArgs[0].substring(guild.prefix.length);
                    let plugins = [];
                    for (const plugin in guild.enabledPlugins) {
                        plugins.push(guild.enabledPlugins[plugin]);
                    }
                    if (plugins.indexOf('custom') != -1) {
                        if (guild.commands.has(cmdArgs[0])) {
                            const command = guild.commands.get(cmdArgs[0]);
                            console.log(command.id);
                            if (typeof command.Message === 'string') {
                                return channel.sendMessage(command.Message);
                            } else if (typeof command.Message === 'function') {
                                return command.Message(message, author, channel, guild, this.client.registry, this.client.guilds, this.client.channels, this.client.users);
                            }
                        }
                    }
                    
                    
                    for (const enabled in plugins) {
                        const plugin = this.client.registry.plugins.get(plugins[enabled])
                        if (typeof plugin !== "object") continue;
                        if ((plugin.commands.has(cmdArgs[0]) || plugin.aliases.has(cmdArgs[0])) || ((plugin.commands.has(cmdArgs[0].toLowerCase()) && !plugin.commands.get(cmdArgs[0].toLowerCase()).caseSensitive) || (plugin.aliases.has(cmdArgs[0].toLowerCase()) && !plugin.commands.get(plugin.aliases.get(cmdArgs[0].toLowerCase())).caseSensitive))) {
                            console.log("Found the command");
                            const command = plugin.commands.get(cmdArgs[0]) || plugin.commands.get(plugin.aliases.get(cmdArgs[0])) || plugin.commands.get(cmdArgs[0].toLowerCase()) || plugin.commands.get(plugin.aliases.get(cmdArgs[0].toLowerCase()));
                            console.log(`plugin: ${plugins[enabled]}, command: ${command.id}, used by: ${author.username}`);
                            try {
                                if (command.subCommands.size > 0 && cmdArgs.length > 1) {
                                    if ((command.subCommands.has(cmdArgs[1]) || command.subCommandsAliases.has(cmdArgs[1])) || (command.subCommands.has(command.subCommandsAliases.get(cmdArgs[1].toLowerCase())) && !command.subCommands.get(command.subCommandsAliases.get(cmdArgs[1].toLowerCase())).caseSensitive)) {
                                        const subCommand = command.subCommands.get(cmdArgs[1]) || command.subCommands.get(command.subCommandsAliases.get(cmdArgs[1])) || command.subCommands.get(cmdArgs[1].toLowerCase()) || command.subCommands.get(command.subCommandsAliases.get(cmdArgs[1].toLowerCase()));
                                        if (typeof subCommand.Message === 'string') {
                                            return channel.sendMessage(subCommand.Message);
                                        } else if (typeof subCommand.Message === 'function') {
                                            return subCommand.Message(message, author, channel, guild, this.client.registry, this.client.guilds, this.client.channels, this.client.users);
                                        }
                                    }
                                }
                                if (typeof command.Message === 'function'){
                                    command.Message(message, author, channel, guild, this.client.registry, this.client.guilds, this.client.channels, this.client.users);
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
