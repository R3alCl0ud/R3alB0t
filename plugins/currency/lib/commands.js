"use strict";

var JSONDir = './credits';
var fs = require('fs');

var initCredits = function(bot, message, author, channel, server) {

    if (!fs.existsSync(JSONDir)) {
        fs.mkdirSync(JSONDir);
    }

    for (var member in server.members) {
        
    }

}





var giveCredit = function(bot, message, author, channel, server) {
    var Args = message.content.split(' ');

    if (Args.length == 1) {

    } else if (Args.length >= 2) {
        console.log(message.mentions.length);
    }
}

exports.registerCMD = function(CommandRegistry, plugin) {

    CommandRegistry.registerPrefix(plugin, "##");
    CommandRegistry.registerCommand(plugin, "initCredits", ["init", "initcredits"], "sets up currency", initCredits, "@everyone");




}
