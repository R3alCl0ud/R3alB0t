"use strict";
let DiscordJS = require("discord.js");
var lib = require('../lib');
var fs = require('fs');
var Plugin = require('../lib/registry/models/Plugin');
var config = lib.openJSON('../options.json');
var Auth = config.Auth;
var bots = {};

bot = new DiscordJS.Client();

function handleStartup() {
    console.log("beginning unit test for r3alb0t");
    var handler = new lib.Bot(bot);
    handler.load();
    handler.startPlugins();
    handler.listen();
    bots = handler;

    console.log(bots.registry)

    tests();

}


function tests() {
    bot.createServer("test", "london").then(server => {
        bot.sendMessage(server.channels[0], "Test message", (message) => {
            for (var plugin in bot.registry.plugins) {
                for (var cmd in bot.registry[plugin].cmds) {
                    try {
                        bot.registry[plugin].cmds[cmd].func(bot, message, message.author, message.channel, message.server, bot.registry)
                    } catch(err) {
                        process.exit(1);
                    }
                }
            }
        });
    });
}


bot.on("ready", handleStartup);

bot.loginWithToken(Auth.token);
