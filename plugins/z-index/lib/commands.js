var help = require("./commandObjects/help");
var uptime = require('./commandObjects/uptime')
var invite = require('./commandObjects/invite');


module.exports = class commands {

    constructor(plugin) {
        if (plugin != null) {
            this.plugin = plugin;

        }
    }

    register(CommandRegistry) {
        CommandRegistry.registerPrefix(this.plugin, "$$");
        CommandRegistry.registerCommand(new help(this.plugin))
        CommandRegistry.registerCommand(new uptime(this.plugin))
        CommandRegistry.registerCommand(new invite(this.plugin))
    }

}
