"use strict";
class command {
    constructor(name, message, plugin) {
        this.plugin = plugin
        this.name = name;
        this.id = name;
        this.message = message;
    }

    func(bot, message, author, channel, server) {
        bot.sendMessage(channel, this.message)
        return;
    }
}

module.exports = command;
