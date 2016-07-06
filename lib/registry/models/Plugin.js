"use strict";


var EventEmitter = require('events').EventEmitter;


class Plugin extends EventEmitter {

    constructor(plugin, bot) {
        super();
        this.bot = bot;
        this.name = plugin.name;
        this.author = plugin.author;
        this.version = plugin.version;
    }

    destroy() {
        
    }

}


module.exports = Plugin;
