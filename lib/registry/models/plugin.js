const EventEmitter = require('events').EventEmitter;
const DiscordJS = require('discord.js');
const CommandObj = require('./command');

class Plugin extends EventEmitter {
    constructor(data = "noID", name = "no name", author = "Anon", version = "0.0.0", description = "No description") {
        super();
        if (typeof data === 'object') {
            this.id = data.id;
            this.name = data.name;
            this.author = data.author;
            this.version = data.version;
            this.description = data.description;
        } else if (typeof data === 'string') {
            this.id = data;
            this.name = name;
            this.author = author;
            this.version = version;
            this.description = description;
        }
        this.commands = new DiscordJS.Collection();
        this.aliases = new DiscordJS.Collection();
    }
    
    registerAlias(command, alias) {
        this.aliases.set(alias, command);
    }

    registerCommand(command) {
        if (command.Message == null) {
            console.log("No message generator supplied");
        } else if (!Object.getPrototypeOf(command) === CommandObj) {
            return new Error("can not register non-command object");
        }
        this.commands.set(command.id, command)
    }
}


module.exports = Plugin;
