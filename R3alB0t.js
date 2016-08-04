"use strict";
var lib = require('./lib');
var fs = require('fs');
var Plugin = require('./lib/registry/models/Plugin');
var DiscordJS = require('discord.js');
var bot = new DiscordJS.Client({
    autoReconnect: true
});
var config = lib.openJSON('./options.json');
var Auth = config.Auth;
var bots = {};
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var handleStartup = function() {
    console.info('Username: ' + bot.user.username);
    console.info('ID: ' + bot.user.id);
    console.info('Servers: ' + bot.servers.length);
    console.info('Channels: ' + bot.channels.length);
    console.info('-----------------------------------------------------------------------------');
    var handler = new lib.Bot(bot);
    handler.load();
    handler.startPlugins();
    handler.listen();
    bots = handler;
}

bot.on("error", (error) => {
    var time = new Date();
    console.log("Oops An error occured!!!\nPrinting out the error report");
    console.log(error.stack);
    console.log("\nSaving the crash log to crashlog-" + date.getFullYear() + date.getMonth() + date.getDate() + ".txt");
    lib.writeJSON("crashlog-" + date.getFullYear() + date.getMonth() + date.getDate() + ".txt", error);
});

var handleServerJoin = function(server) {

}

var handleServerLeave = function(server) {

}

var handleDisconnection = function() {
    console.log("Warning: disconnected");
    bot.loginWithToken(Auth.token);
}

bot.on("ready", handleStartup);
bot.on("disconnected", handleDisconnection);
bot.on("serverCreated", handleServerJoin);
bot.on("serverDeleted", handleServerLeave);

bot.loginWithToken(Auth.token);
