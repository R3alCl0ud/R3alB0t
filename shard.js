const DiscordJS = require('discord.js');
const loginOptions = {shard_id: parseInt(process.env.SHARD_ID, 10), shard_count: parseInt(process.env.SHARD_COUNT, 10), autoReconnect: true};
const lib = require('./');
const config = lib.openJSON('./options.json');
const Auth = config.Auth;
const request = require('request');
const client = new lib.CommandClient(loginOptions);
const redis = require('redis');
const db = lib.db;
const messager = redis.createClient({db: 1});

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
    client.user.setGame("version 3.1.0");
    if (client.channels.has("228779525432016897")) process.send({_logChannel: "Me"})
}


function handleGuildCreate(guild) {
    process.send({_guildCreate: guild});
    client.registry.registerGuild(guild);
}

function handleGuildDelete(guild) {
    process.send({_guildDelete: guild});
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

    if (m._guildCreate){
        if (typeof m._guildCreate === 'object') {
            client.channels.get("228779525432016897").sendMessage(`Joined **${m._guildCreate.name}**. Now I'm in ${m._totalGuilds} guilds`);
            return;
        }
    }
    
    if (m._guildDelete){
        if (typeof m._guildDelete === 'object') {
            client.channels.get("228779525432016897").sendMessage(`Joined **${m._guildDelete.name}**. Now I'm in ${m._totalGuilds} guilds`);
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

messager.on('ready', () =>{
    messager.psubscribe('Guilds.*:changePrefix');
    messager.psubscribe('Guilds.*:addcommand');
    messager.psubscribe('Guilds.*:deletecommand');
    messager.psubscribe('Guilds.*:enable');
    messager.psubscribe('Guilds.*:disable');
})
messager.on('pmessage', (pattern, channel, message) => {
    let guildID = channel.split('.').splice(1).join('');
    let key = guildID.split(':')[1];
    guildID = guildID.split(':')[0];
    message = JSON.parse(message);
    if (client.registry.guilds.has(guildID)) {
        console.log(guildID, key, message)
        const guild = client.registry.guilds.get(guildID);
        if (key === 'changePrefix') { 
            db.set(`Guilds.${this.id}:Prefix`, message.prefix);
            return guild.changePrefix(message.prefix);
        }
        if (key === 'addcommand') {
            return guild.registerCommand(new lib.Command(message.command, message.message, guild));
        }
        if (key === 'deletecommand') { 
            return guild.removeCommand(message.command);
        }
        if (key === 'enable') {
            console.log("umm");
            db.sadd(`Guilds.${guildID}:enabledPlugins`, message.plugin);
            return guild.enablePlugin(message.plugin);
        }
        if (key === 'disable') {
            db.srem(`Guilds.${guildID}:enabledPlugins`, message.plugin);
            return guild.disablePlugin(message.plugin);
        }
    }
});