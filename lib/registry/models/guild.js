const Collection = require('discord.js').Collection;
const Command = require('./command');


module.exports = class guild {
    constructor(guild, data) {
        this.id = guild.id || null;
        this.name = guild.name || "No Name";
        this.commands = new Collection();
        this._prefix = data.prefix || "$$";
        if (data.commands) {
            data.commands.forEach(command => {
                this.registerCommand(new Command(command.title, command.message, this));
            })
        }
        this.enabledPlugins = data.enabledPlugins.length > 0 ? data.enabledPlugins : ["music", "currency", "help", "config", "custom"];
        console.log(this.enabledPlugins)
    }
    
    registerCommand(command) {
        if (command instanceof Command && !this.commands.has(command.id)) {
            this.commands.set(command.id, command);
        }
    }
    
    removeCommand(command) {
        if (this.commands.has(command)) {
            this.commands.delete(command);
        }
    }
    
    enablePlugin(plugin) {
        if (plugin != null && typeof plugin == 'string' && this.enabledPlugins.indexOf(plugin) == -1) {
            console.log(`Enabling plugin: ${plugin}`)
            this.enabledPlugins.push(plugin);
        }
    }
    
    disablePlugin(plugin) {
        if (plugin != null && typeof plugin == 'string' && this.enabledPlugins.indexOf(plugin) != -1) {
            console.log(`Disabling plugin: ${plugin}`)
            const pos = this.enabledPlugins.indexOf(plugin);
            this.enabledPlugins.splice(pos, 1);
            console.log(this.enabledPlugins, pos);
        }
    }
    
    _setPrefix(Prefix) {
        this._prefix = Prefix;
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
