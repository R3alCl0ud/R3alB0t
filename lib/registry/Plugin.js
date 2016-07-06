"use strict";

var EventEmitter = require('events').EventEmitter;


class Plugin extends EventEmitter {

    constructor(name) {
        super();
        this.name = name
    }

    get getName() {
        return "Unamed";
    }

}


module.exports = Plugin;
