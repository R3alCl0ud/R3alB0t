const DiscordJS = require('discord.js');
const Plugin = require('./plugin');

class Command {
    constructor(id, plugin, msgGenerator, options = {}) {
        this.plugin = plugin;
        this._id = id;
        if (typeof msgGenerator === 'Function' && !msgGenerator instanceof Object) {
            this.Message = msgGenerator;
        }
        if (msgGenerator instanceof Object) {
            options = msgGenerator;
        }
        this.dmOnly = options.dmOnly || false;
        if (!this.dmOnly) {
            this.guildOnly = options.guildOnly ? true : false;
        } else if (this.dmOnly) {
            this.guildOnly = false;
        }
        this.caseSensitive = !!options.caseSensitive === true ? true : false;
        this.description = options.description || "Default Description";
        this.subCommands = new DiscordJS.Collection();
        
        if (options.names && options.names instanceof Array) {
            this._addAlias(options.names);
        }
    }
    
    registerSubCommand(id, msgGenerator, options = {}) {
        this.subCommands.set(id, new Command(id, msgGenerator, options));
    }
    
    _addAlias(alias) {
        if (alias instanceof Array) {
            alias.forEach(name => {
                if (this.caseSensitive){
                    this.plugin.registerAlias(this._id, name);
                } else if (!this.caseSensitive) {
                    this.plugin.registerAlias(this._id, name.toLowerCase());
                }
            })    
        } else if (typeof alias === 'string') {
            if (this.caseSensitive){
                this.plugin.registerAlias(this._id, alias);
            } else if (!this.caseSensitive) {
                this.plugin.registerAlias(this._id, alias.toLowerCase());
            }
        }
    }
    
    setAlias(alias) {
        this._addAlias(alias);
    }
    
    get aliases() {
        return this.plugin.aliases.get(this._id);
    }
    
    
    get id() {
        return this._id;
    }
}

module.exports = Command;