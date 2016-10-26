const lib = require('../../../');
const Command = lib.Command;



class config extends Command {
    constructor(plugin, subCommands = []) {
        super("config", null, plugin);
        this.usage += " <setting>";
        
        subCommands.forEach(command => {
            this.registerSubCommand(new command(this));
        });
        
    }
    Message (message, author, channel, guild, registry) {
        channel.sendMessage(`Not much yet`);
    }
}

module.exports = config;