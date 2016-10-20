const lib = require('../../../');
const Command = lib.Command;
const db = lib.db;

class enable extends Command {
    constructor(Parent) {
        super("enable", null, Parent);
        this.caseSensitive = false;
        this.usage = Parent.usage + "enable <plugin>";
    }
    Message (message, author, channel, guild, registry) {
        
    }
}