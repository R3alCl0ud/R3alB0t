const help = require("./commandObjects/helpTest");
const uptime = require('./commandObjects/uptime')
const invite = require('./commandObjects/invite');


module.exports = class commands {

    constructor(plugin) {
        if (plugin != null) {
            this.plugin = plugin;

        }
    }

    register() {
        this.plugin.registerCommand(new help(this.plugin))
        this.plugin.registerCommand(new uptime(this.plugin))
        this.plugin.registerCommand(new invite(this.plugin))
    }

}
