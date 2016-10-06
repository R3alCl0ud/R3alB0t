const DiscordJS = require('discord.js');
const loginOptions = {shard_id: parseInt(process.env.SHARD_ID, 10), shard_count: parseInt(process.env.SHARD_COUNT, 10), autoReconnect: true};
const lib = require('./lib');
const config = lib.openJSON('./options.json');
const Auth = config.Auth;
const request = require('request');
const client = new lib.CommandClient(loginOptions);

// client.login(Auth.token)

function handleStartup() {
    console.info(`Shard ${client.options.shard_id + 1} Ready`)
    console.info(`${client.guilds.size} guilds on this shard`);
    client.load();
}


var handleServerJoin = function(guild) {
 

}

var handleServerLeave = function(server) {

}

var handleDisconnection = function() {
    console.log("Warning: disconnected");
    // client.login(Auth.token);
}

process.on('message', m => {
    console.log(m)

    if (m._joinGuild){
        if (typeof m._joinGuild === 'object')
            client.channels.get("228779525432016897").sendMessage(`Joined **${m._joinGuild.name}**. Now I'm in ${m._totalGuilds} guilds`)
            return;
    }
})

client.on("ready", handleStartup);
client.on("disconnected", handleDisconnection);
client.on("guildCreate", handleServerJoin);
client.on("guildDelete", handleServerLeave);
client.login(Auth.token).catch(console.log);
