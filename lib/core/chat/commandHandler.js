 var CommandRegistry = require('../../../lib/registry/CommandRegistry');
var chatHandler = require('../../../lib/registry/models/ChatHandler');

class ChatHandler extends chatHandler {

    constructor(bot, handler, server) {
        super(handler, handler.server);
        this.bot = bot;
    }

    register(CommandRegistry) {
        super.register();
        this.cmdHandler = this.addCommandHandler();
        this.bot.on("message", this.cmdHandler);
    }

    destroy() {
        this.bot.removeListener("message", this.cmdHandler);
    }

    addCommandHandler() {
        var cmdHandler = super.addCommandHandler();
        return function(message) {
            cmdHandler(message, message.author, message.channel, message.channel.server);
        }.bind(this);
    }
}

module.exports = function(bot, handler) {
    return new ChatHandler(bot, handler);
}
