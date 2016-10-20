const lib = require('../../../');
const Command = lib.Command;
const db = lib.db;

class prefix extends Command {
    constructor(plugin) {
        super("prefix", null, plugin);
        this.usage += " [value]";
        this.caseSensitive = false;
    }
    Message (message, author, channel, guild, registry) {
        let Args = message.content.split(' ').slice(1).slice(1);
        console.log(Args);
        if (Args.length > 0) {
            channel.sendMessage(`Changed my prefix for this guild to ${Args[0]}`);
            db.publish(`Guilds.${guild.id}:changePrefix`, JSON.stringify({prefix: Args[0]}));
            registry.guilds.get(guild.id).changePrefix(Args[0]);
        } else {
            channel.sendMessage("Incorrect argument count");
        }
    }
}

module.exports = prefix;