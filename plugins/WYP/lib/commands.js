var request = require("request")
var https = require("https")
    //var CommandRegistry = require('../../../lib/registry/CommandRegistry');

var prune = function(bot, msg) {
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

var closeBot = function(bot, msg) {
	if (msg.author.id == "100748674849579008") {
		console.log("exiting");
		msg.reply("closing down!");
		process.exit(1);
	}
}

exports.registerCMD = function(CommandRegistry, plugin) {
    CommandRegistry.registerPrefix(plugin, "##");
    CommandRegistry.registerCommand(plugin, 'prune', ["prune"], "delete stuff", prune, "Admins");
	CommandRegistry.registerCommand(plugin, 'closeBot', ["close"], "close", closeBot, "Admins");
};
