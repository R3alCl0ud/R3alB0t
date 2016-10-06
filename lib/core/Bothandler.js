const DiscordJS = require('discord.js');
const util = require('../util/util');
const CommandRegistry = require('../registry/CommandRegistry');
const fs = require('fs');
const pluginFolder = fs.readdirSync("./plugins");
const createChatListner = require('./chat/chatHandler');
const Plugin = require('../registry/models/plugin');
const EventEmitter = require('events');

class LoaderEmitter extends EventEmitter {}

const loaderEmitter = new LoaderEmitter();

loaderEmitter.on('pluginLoadEvent', () => {
    console.log("Plugin loaded.");

});

class Bothandler extends DiscordJS.Client {
    constructor(options) {
        super(options);
        this.client = null;
        this.shardHelper = null;
        this.ready = false;
        this.registry = null;
    }

    load() {
        if (this.registry != null) return;
        this.registry = new CommandRegistry();
        const guilds = this.guilds.array();
        for (var i = 0; i < guilds.length; i++) {
            console.log(guilds[i].id)
            if (typeof guilds[i] === "function") continue;
            if (guilds[i] === null) continue;
            if (guilds[i] === undefined) continue;
            this.registry.registerGuild(guilds[i]);
        }
        this.startPlugins();
        this.listen();
    }

    startPlugins() {
        for (var plugin in pluginFolder) {
            if (fs.lstatSync('./plugins/' + pluginFolder[plugin]).isDirectory()) {
                var plFolder = fs.readdirSync('./plugins/' + pluginFolder[plugin]);
                for (var file in plFolder) {
                    if (!fs.lstatSync('./plugins/' + pluginFolder[plugin] + '/' + plFolder[file]).isDirectory()) {
                        var parts = plFolder[file].split(".");
                        var ext = parts[parts.length - 1];
                        const file_no_ext = parts.splice(0, parts.length - 1).join(".");
                        let potPlugin = require(`../../plugins/${pluginFolder[plugin]}/${file_no_ext}`);

                        if (Object.getPrototypeOf(potPlugin) === Plugin) {
                            const plug = new potPlugin(this.guilds, this.channels, this.users);
                            this.registry.registerPlugin(plug);
                            console.log("New Plugin Found! " + plug.name + " By: " + plug.author);
                            plug.emit('load');
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
            this.cmdListener = new createChatListner(this);
            this.cmdListener.register();
        }
    }


}



module.exports = Bothandler;
