const Collection = require('discord.js').Collection
const Command = require('./command');

module.exports = class guild {
    constructor(data) {
        this.id = data.id || null;
        this.name = data.name || "No Name";
        this._prefix = data.prefix || "$$";
        this.enabledPlugins = data.enabledPlugins || ["music", "currency", "help"];
        this.commands = new Collection();
    }
    
    registerCommand(command) {
        if (command instanceof Command && !this.commands.has(command.id)) {
            this.commands.set(command.id, command);
        }
    }
    
    removeCommand(command) {
        if (this.commands.has(command.id)) {
            this.commands.delete(command.id);
        }
    }
    
    enablePlugin(plugin) {
        if (plugin != null && typeof plugin == 'string' && this.enabledPlugins.indexOf(plugin) == -1) {
            this.enabledPlugins.push(plugin);
        }
    }
    
    disablePlugin(plugin) {
        if (plugin != null && typeof plugin == 'string' && this.enabledPlugins.indexOf(plugin) != -1) {
            const pos = this.enabledPlugins.indexOf(plugin);
            this.enabledPlugins.slice(pos, 1);
        }
    }
    
    _setPrefix(Prefix) {
        this.prefix = Prefix;
    }
    
    changePrefix(Prefix) {
        if (Prefix != null && typeof Prefix == 'string') {
            this._setPrefix(Prefix);
        }
    }
    
    get prefix() {
        return this._prefix;
    }
}
