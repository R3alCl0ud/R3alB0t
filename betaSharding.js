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
        console.log(shard.id)
        logShard = shard;
    }
    // if (guild instanceof String) return;
    if (m._joinGuild) {
        const guild = m._joinGuild
        console.log(typeof guild, guild instanceof DiscordJS.Guild)
        if (typeof guild === 'object'){
            console.log(`Joined: ${m._joinGuild.name}`)
            Manager.fetchClientValues('guilds.size').then(guilds => {
                let totalGuilds = 0
                for (const guildNum in guilds) {
                    totalGuilds += guilds[guildNum];
                }
                logShard.send({_joinGuild: m._joinGuild, _totalGuilds: totalGuilds});
            }).catch(console.log)
        }
    }
})

Manager.spawn();