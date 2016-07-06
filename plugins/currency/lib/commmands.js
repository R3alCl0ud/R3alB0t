"use strict";

var JSONDir = './credits';

var initCredits = function(bot, message, author, channel, server) {

    if (!fs.existsSync(JSONDir)) {
        fs.mkdirSync(JSONDir);
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
}
