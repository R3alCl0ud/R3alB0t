"use strict";
var JSONDir = './credits';
var fs = require('fs');
var lib = require('../../../lib');
var botEvent = {};
var guilds = {};


var Cache = require('./cache'); //Note I DID NOT WRITE THIS! CODE FROM https://github.com/hydrabolt/discord.js/blob/master/src/Util/Cache.js.

class guild {
    constructor(guild) {
        this.id = guild.id;
        this.name = guild.name;
        this.giveRole = guild.giveRole;
        this.members = new Cache;

        if (guild.members instanceof Cache) {
            guild.members.forEach((member) => this.members.add(memeber));
        } else {
            guild.members.forEach((member) => {
                this.members.add(member);
            });
        }
    }
}

function has(array, key, value) {
    return !!get(array, key, value);
}

function get(array, key, value) {
    if (array instanceof Array) {
        for (var item in array) {
            if (array[item].hasOwnProperty(key)) {
                if (array[item][key] == value) {
                    return array[item];
                }
            }
        }
    }
    return null;
}

var handleMessage = function(message, author, channel, server) {
    if (guilds.hasOwnProperty(server.id)) {
        var Guild = guilds[server.id]
        if (Guild.autoGive) {
            if (!Guild.members.has("id", author.id)) {
                var baseUser = {
                    id: author.id,
                    name: author.username,
                    credits: 0,
                    lastTime: message.timestamp
                }
                Guild.members.add(baseUser);
                lib.writeJSON(JSONDir + "/" + Guild.id + ".json");
            } else {
                var user = Guild.members.get("id", author.id);

                if (user.lastTime == 0) {
                    user.lastTime = message.timestamp;
                } else if ((message.timestamp - user.lastTime) >= 60000) {
                    user.lastTime = message.timestamp;
                    user.credits += 10;
                }
                Guild.members.update(Guild.members.get("id", author.id), user);
                lib.writeJSON(JSONDir + "/" + Guild.id + ".json", Guild);
            }
        }
    }
}

class initCredits {
    constructor(plugin) {
        this.plugin = plugin
        this.names = ["init", "initCredits"]
        this.id = "initcredits"
        this.func = function(bot, message, author, channel, server) {
            var Args = message.content.split(" ");
            var serverBase;
            if (!fs.existsSync(JSONDir)) {
                fs.mkdirSync(JSONDir);
            }

            if (!fs.existsSync(JSONDir + '/' + server.id + '.json')) {
                if (Args.length == 2) {
                    serverBase = {
                        id: server.id,
                        name: server.name,
                        giveRole: Args[1],
                        members: []
                    };
                } else {
                    serverBase = {
                        id: server.id,
                        name: server.name,
                        giveRole: "Banker",
                        members: []
                    };
                }
                for (var i = 0; i < server.members.length; i++) {
                    if (server.members[i].equals(message.author)) {
                        var user = {
                            id: server.members[i].id,
                            name: server.members[i].username,
                            credits: 0,
                            lastTime: message.timestamp
                        }
                    } else {
                        var user = {
                            id: server.members[i].id,
                            name: server.members[i].username,
                            credits: 0,
                            lastTime: 0
                        }
                    }
                    serverBase.members.push(user);
                }
                var newGuild = new guild(serverBase);
                guilds[newGuild.id] = newGuild;
                lib.writeJSON(JSONDir + '/' + server.id + '.json', serverBase);
                if (newGuild.giveRole == "Banker")
                    bot.sendMessage(channel, "Finished setting up currency, But you didn't define a role for managing credits, So i set it to `Banker`");
                else
                    bot.sendMessage(channel, "Finished setting up currency, I set the manage credits role to `" + newGuild.giveRole + "`");
            } else {
                bot.sendMessage(channel, "currency has arealy been setup on this server");
            }
        }
    }
}

class giveCredit {
    constructor(plugin) {
        this.plugin = plugin
        this.id = "giveCredits"
        this.names = ["giveCredits", "givec"]
        this.role = "@everyone"
        this.desc = "Gives a user credits"
        this.func = function(bot, message, author, channel, server) {
            var Args = message.content.split(' ');
            if (Args.length == 1 || Args.length == 2) {
                bot.sendMessage(channel, "I need a user to give credits to.\nUsage: `##givecredits @Person credits`");
            } else if (Args.length >= 3) {
                if (message.mentions.length > 0) {
                    if (fs.existsSync(JSONDir + '/' + server.id + '.json')) {
                        var credits = guilds[server.id]
                        if (lib.isRole(message, author, credits.giveRole)) {
                            var person;
                            if (!credits.members.has("id", message.mentions[0].id)) {
                                if (message.mentions[0].equals(author)) {
                                    var user = {
                                        id: message.mentions[0].id,
                                        name: message.mentions[0].username,
                                        credits: Args[2],
                                        lastTime: message.timestamp
                                    }
                                    credits.members.add(user);
                                } else {
                                    var user = {
                                        id: message.mentions[0].id,
                                        name: message.mentions[0].username,
                                        credits: Args[2],
                                        lastTime: 0
                                    }
                                    credits.members.add(user);
                                }
                                person = user;
                            } else {
                                person = credits.members.get("id", message.mentions[0].id);
                            }
                            person.credits += parseInt(Args[2], 10);
                            credits.members.update(credits.members.get("id", message.mentions[0].id), person);
                            lib.writeJSON(JSONDir + '/' + server.id + '.json', credits);
                            bot.sendMessage(channel, "I gave " + person.name + " " + Args[2] + " credit(s)");
                        } else {
                            bot.sendMessage(channel, "Sorry but it seems you don't have permission to give manage credits");
                        }
                    } else {
                        bot.sendMessage(channel, "Sorry but currency hasn't been setup on this server");
                    }
                } else {
                    message.reply("You didn't mention anyone");
                }
            }
        }
    }
}
class setAuto {
    constructor(plugin) {
        this.plugin = plugin;
        this.id = "setAuto"
        this.names = ["setAuto", "sauto", "seta"];
        this.role = "@everyone"
        this.func = function(bot, message, author, channel, server) {
            if (guilds.hasOwnProperty(server.id)) {
                var guild = guilds[server.id];
                if (lib.isRole(message, author, guild.giveRole)) {
                    guild.autoGive = !guild.autoGive;
                    bot.sendMessage(channel, "Automatic credit dispencing has been set to `" + guild.autoGive + "`");
                    lib.writeJSON(JSONDir + "/" + guild.id + ".json", guild);
                } else {
                    bot.sendMessage(channel, "You don't have permission to change this setting");
                }
            }
        }
    }
}
class setRole {
    constructor(plugin) {
        this.plugin = plugin
        this.id = "setRole"
        this.names = ["setcreditrole", "scr", "setrolecredits", "src", "creditrole"]
        this.role = "@everyone"
        this.func = function(bot, message, author, channel, server) {
            var Args = message.content.split(" ");
            if (Args.length >= 2) {
                if (guilds.hasOwnProperty(server.id)) {
                    var guild = guilds[server.id];
                    if (lib.isRole(message, author, guild.giveRole)) {
                        guild.giveRole = Args[1];
                        lib.writeJSON(JSONDir + "/" + guild.id + ".json", guild);
                    } else {
                        bot.sendMessage(channel, "You don't have permission to change this setting");
                    }
                }
            }
        }
    }
}



class viewCredit {
    constructor(plugin) {
        this.plugin = plugin
        this.id = "viewCredit"
        this.names = ["credits", "viewcredits"]
        this.desc = "Shows you how many credits you have"
        this.role = "@everyone"
        this.func = function(bot, message, author, channel, server) {
            if (fs.existsSync(JSONDir + '/' + server.id + '.json')) {
                var credits = guilds[server.id]
                if (!credits.members.has("id", author.id)) {
                    var user = {
                        id: author.id,
                        name: author.usernam0e,
                        credits: 0,
                        lastTime: message.timestamp
                    }
                    credits.members.add(user);
                }
                lib.writeJSON(JSONDir + '/' + server.id + '.json', credits);
                var person = credits.members.get("id", author.id);
                bot.sendMessage(channel, "You have " + person.credits + " credit(s)");
            } else {
                bot.sendMessage(channel, "Sorry but currency hasn't been setup on this server");
            }
        }
    }
}

exports.registerCMD = function(CommandRegistry, plugin) {
    botEvent = plugin.bot;
    CommandRegistry.registerPrefix(plugin, "#$");
    CommandRegistry.registerCommand(plugin, "initCredits", ["init", "initcredits"], "sets up currency", initCredits, "@everyone");
    CommandRegistry.registerCommand(plugin, "giveCredits", ["givec", "givecredits"], "Gives a user credits", giveCredit, "@everyone");
    CommandRegistry.registerCommand(plugin, "viewCredits", ["credits", "viewcredits"], "Shows how many credits you have", viewCredit, "@everyone");
    CommandRegistry.registerCommand(plugin, "setRole", ["setcreditrole", "scr", "setrolecredits", "src", "creditrole"], "Allows you to set the role required to manage credits on the server", setRole, "@everyone");
    CommandRegistry.registerCommand(plugin, "setAuto", ["setauto", "sauto"], "Turn automatic credit dispencing on or off", setAuto, "@everyone");

}


module.exports = class commands {
    constructor(plugin) {
        this.plugin = plugin;
        this.bot = plugin.bot;
    }

    register(CommandRegistry) {
        CommandRegistry.registerPrefix(this.plugin, "$$")
        CommandRegistry.registerCommand(new initCredits(this.plugin))
        CommandRegistry.registerCommand(new viewCredit(this.plugin))
        CommandRegistry.registerCommand(new giveCredit(this.plugin))
        CommandRegistry.registerCommand(new setAuto(this.plugin))
        CommandRegistry.registerCommand(new setRole(this.plugin))

        this.bot.on("message", (msg) => {
            handleMessage(msg, msg.author, msg.channel, msg.channel.server)
        });

        if (fs.existsSync(JSONDir)) {
            var dir = fs.readdirSync(JSONDir);
            for (var file in dir) {
                var Guild = lib.openJSON(JSONDir + "/" + dir[file]);
                if (!Guild.hasOwnProperty("giveRole")) {
                    Guild.giveRole = "Banker";
                }
                if (!Guild.hasOwnProperty("autoGive")) {
                    Guild.autoGive = false;
                }
                lib.writeJSON(JSONDir + "/" + dir[file], Guild);
                var newGuild = new guild(Guild);
                guilds[newGuild.id] = newGuild;
            }
        }



    }
}
