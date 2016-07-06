"use strict";

var DiscordJS = require('discord.js').Client;
var util = require('../util/util');
var CommandRegistry = require('../registry/CommandRegistry');
// var EventEmitter = require('events').EventEmitter;
var EventEmitter = require('events');
var fs = require('fs');
var pluginFolder = fs.readdirSync("./plugins");
var createCMDListner = require('./chat/commandHandler');
var plugins = util.openJSON("plugins.json");
var Plugin = require('../registry/models/Plugin');
var EventEmitter = require('events');

class LoaderEmitter extends EventEmitter {}

const loaderEmitter = new LoaderEmitter();

loaderEmitter.on('pluginLoadEvent', () => {
    console.log("Plugin loaded.");

});

class Bothandler {

    constructor(session) {
        if (session instanceof DiscordJS) {
            this.session = null;
            this.bot = session;
            this.ready = true;
        } else {
            this.session = session;
            this.bot = null;
            this.ready = false;
        }
        this.registry = null;
        this.plugins = [];
        this.player = null;
        this.keys = {
            soundcloud: null
        };
    }

    login(information) {
        if (this.bot == null && this.session != null) {
            this.bot = new DiscordJS.Client();
            if (this.session.hasOwnProperty('token')) {
                this.bot.loginWithToken(this.session);
            }
        }
    }

    load() {
        if (this.registry != null) return;
        this.registry = new CommandRegistry();

    }

    startPlugins() {
        for (var plugin in pluginFolder) {
            if (fs.lstatSync('./plugins/' + pluginFolder[plugin]).isDirectory()) {
                var plFolder = fs.readdirSync('./plugins/' + pluginFolder[plugin]);
                for (var file in plFolder) {
                    if (!fs.lstatSync('./plugins/' + pluginFolder[plugin] + '/' + plFolder[file]).isDirectory()) {
                        var parts = plFolder[file].split(".");
                        var ext = parts[parts.length - 1];
                        var file_no_ext = parts.splice(0, parts.length - 1).join(".");
                        var potPlugin = null;
                        try {
                            // This will attempt to load the potential plugin data file.
                            loaderEmitter.emit('pluginLoadEvent');
                            potPlugin = require('../../plugins/' + pluginFolder[plugin] + '/' + file_no_ext)(this.bot, this.registry);
                        } catch (err) {
                            potPlugin = null;
                            console.log("An error has occurred loading this file, there could be an error, or this is simply not a JavaScript file.");
                            console.log(err);

                            continue;
                        }

                        if (potPlugin instanceof Plugin) {
                            console.log("New Plugin Found! " + potPlugin.name + " By: " + potPlugin.author);
                            potPlugin.loadPlugin();
                        } else {
                            console.log("Non-plugin object found, ignoring");
                            potPlugin = null;
                        }
                    }
                }
            }
        }
    }

    listen() {
        if (this.cmdListener == null) {
            this.cmdListener = createCMDListner(this.bot, this);
            this.cmdListener.register();
        }
    }


}



module.exports = Bothandler;
