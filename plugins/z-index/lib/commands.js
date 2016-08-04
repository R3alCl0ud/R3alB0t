var help = require("./commandObjects/help");


module.exports = class commands {

    constructor(plugin) {
        if (plugin != null) {
            this.plugin = plugin;

        }
    }

    register(CommandRegistry) {
        CommandRegistry.registerPrefix(this.plugin, "$$");
        CommandRegistry.registerCommand(new help(this.plugin))
    }

}
