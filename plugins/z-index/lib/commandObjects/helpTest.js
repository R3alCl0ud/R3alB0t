const lib = require('../../../../lib');

module.exports = class help extends lib.Command {
    constructor(plugin) {
        super("help", plugin)
    }
    
    Message (message, author, channel, guild, guilds, channels, users, registry) {
        const guild = registry.guilds.get(guild.id);
        
    }
}