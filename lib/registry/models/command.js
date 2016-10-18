const DiscordJS = require('discord.js');
const Plugin = require('./plugin');

/**
 * Options to be passed to used in a command
 * @typedef {Object} CommandOptions
 * @property {boolean} [caseSensitive=true] Whether or not the command should be case sensitive
 * @property {boolean} [dmOnly=false] Whether or not the command can only be ran in direct messages only
 * @property {boolean} [guildOnly=false] Whether or not the command can only be ran in a guild text channel. Cannot be true if dmOnly is true
 * @property {string} [description=Default Description] The description of the command
 * @property {string} [usage=command ID] The usage for the command
 */

/**
 * The Command Object
 */
class Command {

    /**
     * @param {string} ID The ID of the command
     * @param {MessageGenerator} function|string|falsy 
     * @param {ParentObject} parent This can be a guild, plugin. This should be a command if you are registering a SubCommand.
     * @param {CommandOptions} options 
     */
    constructor(id, msgGenerator, parent, options = {}) {
        
        /**
         * The Parent of the command
         * @type {(Plugin|Command|Guild)}
         */ 
        this.Parent = parent;
        
        /**
         * The ID of the command
         * @type {string}
         */
        this._id = id;
        
        /**
         * 
         * @type {boolean}
         */
        this.caseSensitive = true;
        /**
         * 
         * @type {boolean}
         */
        this.dmOnly = false;
        
        /**
         * 
         * @type {boolean}
         */
        this.guildOnly = false;
        
                /**
         * The description of the command
         * @type {string}
         */
        this.description = "Default Description";
        /**
         * The usage of the command
         * @type {string}
         */
        this.usage = `${this.id}`;
        /**
         * The aliases of the command
         * @type {Array}
         */
        this.names = [];
        
        if (msgGenerator instanceof Array) {
            msgGenerator.forEach(message => {
               this.responses.push(message); 
            });
        } else if (typeof msgGenerator === 'string') {
            this.Message = msgGenerator;
        }
        
        for (const option of Object.keys(options)) {
            this[option] = options[option];
        }
        
        this.subCommands = new DiscordJS.Collection();
        this.subCommandsAliases = new DiscordJS.Collection();
        
        
        if (this.names && this.names instanceof Array) {
            this._addAlias(this.names);
        } else if (this.names && typeof this.names === 'string') {
            this._addAlias(this.names);
        }
    }
    
    registerSubCommand(CommandOrId, msgGenerator, options) {
        if (CommandOrId instanceof Command) {
            this.subCommands.set(CommandOrId.id, CommandOrId);
        } else if (typeof CommandOrId === 'string'){
            this.subCommands.set(CommandOrId, new Command(CommandOrId, msgGenerator, this, options));
        }
    }
    
    
    setSubAlias(subCommand, alias) {
        this.subCommandsAliases.set(alias, subCommand);
    }
    
    _addAlias(alias) {
        if (this.Parent instanceof Command) {
            if (alias instanceof Array) {
                return alias.forEach(name => {
                    this.Parent.setSubAlias(this.id, this.caseSensitive ? name : name.toLowerCase());
                    if (this.names.indexOf(name) == -1) this.names.push(this.caseSensitive ? name : name.toLowerCase());
                });
            } else if (typeof alias === 'string'){
                if (this.names.indexOf(alias) == -1) this.names.push(this.caseSensitive ? alias : alias.toLowerCase());
                return this.Parent.setSubAlias(this.id, this.caseSensitive ? alias : alias.toLowerCase());
            }
        }
        if (alias instanceof Array) {
            alias.forEach(name => {
                this.Parent.registerAlias(this._id, this.caseSensitive ? name : name.toLowerCase());
                if (this.names.indexOf(name) == -1) this.names.push(this.caseSensitive ? name : name.toLowerCase());
            })    
        } else if (typeof alias === 'string') {
            this.Parent.registerAlias(this._id, this.caseSensitive ? alias : alias.toLowerCase());
            if (this.names.indexOf(alias) == -1) this.names.push(this.caseSensitive ? alias : alias.toLowerCase());
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