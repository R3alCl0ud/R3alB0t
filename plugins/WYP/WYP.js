const Plugin = require('DiscordForge').Plugin;
let commands = require('./lib/commands');

class wagYourCommands extends Plugin {

  constructor() {
      super(plugin.id, plugin.name, plugin.author, plugin.version, "WagYourCommands");
      this.loaded = false;
      this.on('load', this.loadPlugin.bind(this));
  }

  loadPlugin() {
      if (!this.loaded) {
          commands = new commands(this);
          commands.register();
          this.loaded = true;
      }
  }
}

var plugin = {
    name: "wagyourplugin",
    id: "WYP",
    author: "wagyourtail",
    version: "0.0.0"
}


module.exports = function(bot, registry) {
    return new wagYourCommands(bot, plugin, registry);
};
