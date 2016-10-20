const DiscordJS = require('discord.js');
const Guild = require('./models/guild');
const lib = require('../../');
const db = lib.db;
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
            db.multi()
            .get(`Guilds.${guild.id}:Prefix`)
            .smembers(`Guilds.${guild.id}:enabledPlugins`)
            .smembers(`Commands.${guild.id}:commands`)
            .sort(`Commands.${guild.id}:commands`, "by", `Commands.${guild.id}:commands`, "get", `Commands.${guild.id}:command:*`)
            .exec((err, results) => {
                if (err) throw err;
                const data = {
                    prefix: results[0],
                    enabledPlugins: results[1],
                    commands: []
                };
                results[3].forEach((command, index) => {
                    data.commands.push({title: results[2][index], message: command});
                });
                this.guilds.set(guild.id, new Guild(guild, data))
            })
        }
    }

    reloadPlugin(plugin) {

    }

    registerPlugin(plugin) {
        this.plugins.set(plugin.id, plugin);
    }
}

module.exports = CommandRegistry;
