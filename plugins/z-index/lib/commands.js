var cmdReg = {};

var help = function(bot, msg, usr) {
    var helpMSG = [];
    var Args = msg.content.split(' ');
    if (Args.length == 1) {
        helpMSG.push("**~Plugins~**\nType ##help <plugin> to view the commands for the plugin");
        for (var plugin in cmdReg.cmds) {
            helpMSG.push("`" + plugin + "`");
        }
        bot.sendMessage(msg.channel, helpMSG);
    } else {
        if (cmdReg.cmds.hasOwnProperty(Args[1])) {
            helpMSG.push("**~Show Commands For " + Args[1] + "~**")
            for (var cmd in cmdReg.cmds[Args[1]]) {
                var prefix = cmdReg.prefixes[Args[1]].prefixes;
                helpMSG.push("`" + prefix + cmd + "` : **" + cmdReg.cmds[Args[1]][cmd].desc + "** Aliases: " + cmdReg.cmds[Args[1]][cmd].name.join(", "));
            }
        }
        bot.sendMessage(msg.channel, helpMSG);
    }
}

exports.registerCMD = function(CommandRegistry, plugin) {
    cmdReg = CommandRegistry;
    CommandRegistry.registerPrefix(plugin, "##");
    CommandRegistry.registerCommand(plugin, 'help', ["help", "halp"], "The Help command", help, "@everyone");
}
