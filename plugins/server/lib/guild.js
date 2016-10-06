var DiscordJS = require('discord.js')

module.exports = class guild {
    constructor(data) {
        this.id = data.id || null
        this.name = data.name || "No Name"
        this.prefix = data.prefix || "$$"
        this.enabledPlugins = data.enabledPlugins || ["help", "music"]
    }
}
