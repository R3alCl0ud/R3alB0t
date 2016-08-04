var exmpleRole = require("./commands/exampleRole");

var example = function(bot, msg, usr, channel, server) {
    msg.reply("Example Reply");
    bot.emit("test", channel);
}

//var exampleRole = function(bot, msg, usr, mentions) {
//    msg.reply("not done yet");
//}
var registerCMD = function(CommandRegistry, plugin) {

    //CommandRegistry.registerPrefix(plugin, "#$");
    //CommandRegistry.registerCommand(plugin, 'examplecommand', ["test", "examplecommand"], "Exmaple Command for API docs", exampleCMD, "@everyone");
}


module.exports =


class commandRegister {

    constructor(plugin) {
        if (plugin != null) {
            this.plugin = plugin;

        }
    }

    register(CommandRegistry) {
        CommandRegistry.registerPrefix(this.plugin, "$$");
        CommandRegistry.registerCommand(new exmpleRole(this.plugin))
    }

}
