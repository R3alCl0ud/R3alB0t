var CommandRegistry = require('../../../lib/registry/CommandRegistry');
var chatHandler = require('../../../lib/registry/models/ChatHandler');

class exampleChatHandler extends chatHandler {

    constructor(bot, handler) {
        super(handler);
        this.bot = bot;
    }

    register() {
        super.register();
        this.cmdHandler = this.addCommandHandler();
        this.bot.on("message", this.cmdHandler);
    }

    destroy() {
        this.bot.removeListener("message", this.cmdHandler);
    }

    addCommandHandler() {
        var cmdHandler = super.addCommandHandler();
        return function(msg) {
            cmdHandler(msg, msg.author);
        }.bind(this);
    }
}

module.exports = function(bot, handler) {
    return new exampleChatHandler(bot, handler);
}
