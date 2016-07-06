var exampleCMD = function (bot, msg, usr, mentions) {
    msg.reply("Example Reply");
}

var exampleRoleCMD = function (bot, msg, usr, mentions) {
    msg.reply("not done yet");
}

exports.registerCMD = function(CommandRegistry, plugin) {

    CommandRegistry.registerPrefix(plugin, "##");
    CommandRegistry.registerCommand(plugin, 'examplecommand', ["test", "examplecommand"], "Exmaple Command for API docs", exampleCMD, "@everyone");

    //var exampleCommand = new CommandRegistry.Command("exampleCommand", "Exmaple Command for API docs", exampleCmd);
    //var exampleTwo = new CommandRegistry.Command("exampleTwo", "Another Example for testing", function() {});
    //var testCommand = new CommandRegistry.Command("testCommand", "A test plugin!", function() {});
    //var exampleRole = new CommandRegistry.Command("exampleRole", "Example for checking if a user has a role", exampleRoleCMD);
}
