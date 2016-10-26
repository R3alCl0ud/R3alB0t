var request = require("request")
var https = require("https")
    //var CommandRegistry = require('../../../lib/registry/CommandRegistry');

class prune {
    constructor(plugin) {
        this.plugin = plugin || null;
        this.id = "prune";
        this.names = ["prune"]
        this.role = "Admins"
        this.desc = "delete stuff"
    }
    func(bot, msg, author, channel, server) {
        var Args = msg.content.split(" ");
        channel.fetchMessages({
            limit: parseInt(Args[1], 10)
        }).then(messages => {
            channel.sendMessage(`Deleted ${Args[1]} message(s)`);
            channel.bulkDelete(messages);
        })

    }
}






module.exports = class commands {
    constructor(plugin) {
        this.plugin = plugin;
        this.bot = plugin.bot;
    }

    register(CommandRegistry) {
        CommandRegistry.registerPrefix(this.plugin, "$$")
        CommandRegistry.registerCommand(new prune(this.plugin))
    }
}
