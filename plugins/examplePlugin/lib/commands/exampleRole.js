var runnable = function(bot, msg, usr, channel, server) {
    msg.reply("not done yet");
};

module.exports = class exampleRole {
    constructor(plugin) {
        if (plugin != null) {
            this.plugin = plugin;
        }
        this.id = "exampleRole";
        this.desc = "Example Description";
        this.names = ["exampleRole", "exampleRoles", "roleTest"];
        this.func = function(bot, message, author, channel, server) {
            channel.sendMessage("testing");
        }
        this.role = "@everyone";
    }

}
