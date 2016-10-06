var Plugin = require('../../../lib/registry/models/plugin');

class customCommands extends Plugin {

    constructor(server) {
        super("Custom Commands");
        this.id = "customCommands" + server;
        this.name = "Custom Commands";
        this.description = "Your custom commands";
    }

}

module.exports = customCommands;
