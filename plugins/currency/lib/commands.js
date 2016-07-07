"use strict";
var JSONDir = './credits';
var fs = require('fs');
var lib = require('../../../lib');


function has(array, key, value) {
    return !!get(array, key, value);
}

function get(array, key, value) {
    for (var item in array) {
        if (array[item].hasOwnProperty(key)) {
            if (array[item][key] == value) {
                return array[item];
            }
        }
    }
    return null;
}

var initCredits = function(bot, message, author, channel, server) {
    var serverBase;
    if (!fs.existsSync(JSONDir)) {
        fs.mkdirSync(JSONDir);
    }

    if (!fs.existsSync(JSONDir + '/' + server.id + '.json')) {
        serverBase = {
            id: server.id,
            name: server.name,
            members: []
        };
        for (var i = 0; i < server.members.length; i++) {
            var user = {
                id: server.members[i].id,
                name: server.members[i].username,
                credits: 0
            }
            serverBase.members.push(user);
        }
        lib.writeJSON(JSONDir + '/' + server.id + '.json', serverBase);
        bot.sendMessage(channel, "Finished setting up currency");
    } else {
        bot.sendMessage(channel, "currency has arealy been setup on this server");
    }
}

var giveCredit = function(bot, message, author, channel, server) {
    var Args = message.content.split(' ');
    if (Args.length == 1 || Args.length == 2) {
        bot.sendMessage(channel, "I need a user to give credits to.\nUsage: `##givecredits @Person credits`");
    } else if (Args.length >= 3) {
        if (message.mentions.length > 0) {
            if (fs.existsSync(JSONDir + '/' + server.id + '.json')) {
                var credits = lib.openJSON(JSONDir + '/' + server.id + '.json');
                var person;
                if (!has(credits.members, "id", message.mentions[0].id)) {
                    var user = {
                        id: message.mentions[0].id,
                        name: message.mentions[0].username,
                        credits: Args[2]
                    }
                    person = user;
                    credits.members.push(user);
                } else {
                    person = get(credits.members, "id", message.mentions[0].id);
                }
                person.credits += parseInt(Args[2], 10);
                lib.writeJSON(JSONDir + '/' + server.id + '.json', credits);
                bot.sendMessage(channel, "I gave " + person.name + " " + Args[2] + " many credit(s)");
            } else {
                bot.sendMessage(channel, "Sorry but currency hasn't been setup on this server");
            }
        } else {
            message.reply("umm you can't give your self credits");
        }
    }
}


var viewCredit = function(bot, message, author, channel, server) {
    if (fs.existsSync(JSONDir + '/' + server.id + '.json')) {
        var credits = lib.openJSON(JSONDir + '/' + server.id + '.json');
        if (!has(credits.members, "id", author.id)) {
            var user = {
                id: author.id,
                name: author.username,
                credits: 0
            }
            credits.members[credits.members.length] = user;
        }
        lib.writeJSON(JSONDir + '/' + server.id + '.json', credits);
        var person = get(credits.members, "id", author.id);
        bot.sendMessage(channel, "You have " + person.credits + " credit(s)");
    } else {
        bot.sendMessage(channel, "Sorry but currency hasn't been setup on this server");
    }
}


exports.registerCMD = function(CommandRegistry, plugin) {

    CommandRegistry.registerPrefix(plugin, "##");
    CommandRegistry.registerCommand(plugin, "initCredits", ["init", "initcredits"], "sets up currency", initCredits, "@everyone");
    CommandRegistry.registerCommand(plugin, "giveCredits", ["givec", "givecredits"], "Gives a user credits", giveCredit, "Banker");
    CommandRegistry.registerCommand(plugin, "viewCredits", ["credits", "viewcredits"], "Shows how many credits you have", viewCredit, "@everyone");

}
