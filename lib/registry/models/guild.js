const Collection = require('discord.js').Collection
const Command = require('./command');
const redis = require('redis');
const db = redis.createClient({db: 1});


module.exports = class guild {
    constructor(data) {
        this.id = data.id || null;
        this.name = data.name || "No Name";
        // db.set(`Guilds.${this.id}:prefix`, "$$")
        db.sadd(`Guilds.${this.id}:enabledPlugins`, "help");
        db.sadd(`Guilds.${this.id}:enabledPlugins`, "music");
        db.sadd(`Guilds.${this.id}:enabledPlugins`, "currency");
        db.sadd(`Guilds.${this.id}:enabledPlugins`, "config");
        db.get(`Guilds.${this.id}:prefix`, (err, prefix) => {
            if (err) return err;
            
            this._prefix = prefix || "$$";
        })
        db.smembers(`Guilds.${this.id}:enabledPlugins`, (err, plugins) => {
            if (err) throw err;
            
            this.enabledPlugins = plugins || ["music", "currency", "help", "config"];
            
        });
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
