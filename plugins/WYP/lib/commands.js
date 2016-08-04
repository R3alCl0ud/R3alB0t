var request = require("request")
var https = require("https")
    //var CommandRegistry = require('../../../lib/registry/CommandRegistry');

class prune {
    constructor(plugin) {
        this.plugin = plugin
        this.id = "prune";
        this.names = ["prune"]
        this.role = "Admins"
        this.desc = "delete stuff"
        this.func = function(bot, msg) {
            bot.getChannelLogs(msg.channel, parseInt(msg.content.split(" ")[1]), "before", function(error, messages) {
                mass = messages;
                msg.reply("attempting to remove `" + parseInt(msg.content.split(" ")[1]) + "` messages.")
                var x = 0;
                var Intval = setInterval(function() {
                    //console.log(x);
                    if (mass != null) {
                        bot.deleteMessage(mass[x]);
                        x++;
                        if (x > mass.length) {
                            clearInterval(Intval);
                        }
                    } else {
                        msg.reply("i don't see any messages here... are you trying to delete the channel?")
                    }
                }, 500);
            });
        }
    }
}



module.exports = class commands {
    constructor(plugin) {
        this.plugin = plugin;
        this.bot = plugin.bot;
    }

    register(CommandRegistry) {
        CommandRegistry.registerPrefix(this.plugin, "#$")
        CommandRegistry.registerCommand(new prune(this.plugin))
    }
}
