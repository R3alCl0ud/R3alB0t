var CommandRegistry = require('../../../lib/registry/CommandRegistry');
//var lib = require('../../../lib');


var exampleCmd = function (bot, msg, usr) {
    msg.reply("Example Reply");
}

var exampleRoleCMD = function (bot, msg, usr) {
    msg.reply("not done yet");
}

exports.registerCMD = function() {    
    var exampleCommand = new CommandRegistry.Command("exampleCommand", "Exmaple Command for API docs", exampleCmd);
    var exampleTwo = new CommandRegistry.Command("exampleTwo", "Another Example for testing", function() {});
    var testCommand = new CommandRegistry.Command("testCommand", "A test plugin!", function() {});
    var exampleRole = new CommandRegistry.Command("exampleRole", "Example for checking if a user has a role", exampleRoleCMD);
}
