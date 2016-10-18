const DiscordJS = require('discord.js');
const loginOptions = {shard_id: parseInt(process.env.SHARD_ID, 10), shard_count: parseInt(process.env.SHARD_COUNT, 10), autoReconnect: true};
const lib = require('./');
const config = lib.openJSON('./options.json');
const Auth = config.Auth;
const request = require('request');
const client = new lib.CommandClient(loginOptions);
const redis = require('redis');
const db = lib.db;


class helpSub extends lib.Command {
    constructor(parent, command) {
        super(command.id, null, parent);
        this.setAlias(command.names);
        this.usage = command.usage;
        this.description = command.description;
    }
    Message(message, author, channel, guild, registry) {
        let names = this.names.length >= 1 ? this.names.join(', ') : "No aliases";
        channel.sendMessage(`**Showing more info for:** \`${this.id}\`\n**Aliases:** ${names}\n**Description:** ${this.description}\n**Usage:** \`${registry.guilds.get(guild.id).prefix}${this.usage}\``).catch(console.log);
    }
}




function handleStartup() {
    console.info(`Shard ${client.options.shard_id + 1} Ready`);
    console.info(`${client.guilds.size} guilds on this shard`);
    client.load();
    client.user.setGame("version 3.0.1");
}


function handleGuildCreate(guild) {
 

}

function handleGuildDelete(guild) {

}

function handleDisconnection() {
    console.log("Warning: disconnected");
}

function handleHelp() {
    const helpCommand = client.registry.plugins.get('help').commands.get('help');
    client.registry.plugins.forEach(plugin => {
        plugin.commands.forEach(command => {
            helpCommand.registerSubCommand(new helpSub(helpCommand, command));
        });
    });
}

process.on('message', m => {
    console.log(m)

    if (m._joinGuild){
        if (typeof m._joinGuild === 'object') {
            client.channels.get("228779525432016897").sendMessage(`Joined **${m._joinGuild.name}**. Now I'm in ${m._totalGuilds} guilds`);
            return;
        }
    }
})

client.on("ready", handleStartup);
client.on('loaded', handleHelp);
client.on("disconnected", handleDisconnection);
client.on("guildCreate", handleGuildCreate);
client.on("guildDelete", handleGuildDelete);
client.login(Auth.token).catch(console.log);

db.on('ready', () =>{
    db.psubscribe('Guilds.*:prefix');
    db.psubscribe('Guilds.*:addcommand');
    db.psubscribe('Guilds.*:deletecommand');
    db.psubscribe('Guilds.*:enable');
    db.psubscribe('Guilds.*:disable');
})
db.on('pmessage', (pattern, channel, message) => {
    let guildID = channel.split('.').splice(1).join('');
    let key = guildID.split(':')[1];
    guildID = guildID.split(':')[0];
    message = JSON.parse(message);
    if (client.registry.guilds.has(guildID)) {
        const guild = client.registry.guilds.get(guildID);
        if (key === 'prefix') return guild.changePrefix(message[key]);
        if (key === 'addcommand') return guild.registerCommand(new lib.Command(message.command, message.message, guild));
        if (key === 'deletecommand') return guild.removeCommand(message.command);
        if (key === 'enable') return guild.enablePlugin(message[key]);
        console.log(guildID, key, message)
    }
})