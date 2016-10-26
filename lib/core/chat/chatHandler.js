const CommandRegistry = require('../../../lib/registry/CommandRegistry');
const commandHandler = require('../../../lib/registry/models/CommandHandler');

class chatHandler extends commandHandler {

    constructor(client) {
        super(client);
    }

    register(registry) {
        super.register();
        this.cmdHandler = this.addCommandHandler();
        this.client.on('message', this.cmdHandler);
        this.client.on('message', msg => {
            this.client.registry.plugins.get('currency').emit('message', this.client, msg);
        });
    }

    destroy() {
        this.bot.removeListener("message", this.cmdHandler);
    }

    addCommandHandler() {
        var cmdHandler = super.addCommandHandler();
        return function(message) {
            cmdHandler(message, message.author, message.channel, message.guild);
        }.bind(this);
    }
}

module.exports = chatHandler;
