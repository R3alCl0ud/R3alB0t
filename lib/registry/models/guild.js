const Collection = require('discord.js').Collection
const Command = require('./command');
const redis = require('redis');
const db = redis.createClient({db: 1});


module.exports = class guild {
    constructor(data) {
        this.id = data.id || null;
        this.name = data.name || "No Name";
        this.commands = new Collection();
        // db.set(`Guilds.${this.id}:prefix`, "$$")
        // db.sadd(`Guilds.${this.id}:enabledPlugins`, "custom");
        db.multi()
        .get(`Guilds.${this.id}:prefix`)
        .smembers(`Guilds.${this.id}:enabledPlugins`)
        .smembers(`Commands.${this.id}:commands`)
        .sort(`Commands.${this.id}:commands`, "by", `Commands.${this.id}:commands`, "get", `Commands.${this.id}:command:*`)
        .exec((err, results) => {
            if (err) throw err;
            this._prefix = results[0] || "$$";
            this.enabledPlugins = results[1].length > 0 ? results[1] : ["music", "currency", "help", "config", "custom"];
            results[3].forEach((command, index) => {
                this.registerCommand(new Command(results[2][index], command, this));
            });
            
        })
        
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
            db.sadd(`Guilds.${this.id}:enablePlugins`, plugin);
            this.enabledPlugins.push(plugin);
        }
    }
    
    disablePlugin(plugin) {
        if (plugin != null && typeof plugin == 'string' && this.enabledPlugins.indexOf(plugin) != -1) {
            const pos = this.enabledPlugins.indexOf(plugin);
            db.srem(`Guilds.${this.id}:enablePlugins`, plugin);
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
