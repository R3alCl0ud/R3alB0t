const DiscordJS = require('discord.js');
const shard = './shard.js'
const Manager = new DiscordJS.ShardingManager(shard, 4);
let logShard;

Manager.on('launch', shard => {
    console.log(`Shard ${shard.id} has been launched`);
})

Manager.on('message', (shard, m) => {
    console.log(m)
    
    
    if (m._logChannel) {
        console.log("log shard: ", shard.id);
        logShard = shard;
        return;
    }
    // if (guild instanceof String) return;
    if (m._guildCreate) {
        const guild = m._guildCreate
        console.log(typeof guild, guild instanceof DiscordJS.Guild)
        if (typeof guild === 'object'){
            console.log(`Joined: ${guild.name}`)
            Manager.fetchClientValues('guilds.size').then(guilds => {
                let totalGuilds = guilds.reduce((prev, val) => prev + val, 0);
                logShard.send({_guildCreate: m._guildCreate, _totalGuilds: totalGuilds});
            }).catch(console.log)
        }
    }
    if (m._guildDelete) {
        const guild = m._guildDelete
        console.log(typeof guild, guild instanceof DiscordJS.Guild)
        if (typeof guild === 'object'){
            console.log(`Left: ${guild.name}`)
            Manager.fetchClientValues('guilds.size').then(guilds => {
                let totalGuilds = guilds.reduce((prev, val) => prev + val, 0);
                logShard.send({_guildDelete: m._guildDelete, _totalGuilds: totalGuilds});
            }).catch(console.log)
        }
    }
})

Manager.spawn();