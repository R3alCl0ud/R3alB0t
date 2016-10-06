module.exports = class invite {
    constructor(plugin) {
        this.plugin = plugin;
        this.id = "invite";
        this.names = ["invite"];
        this.role = "@everyone";
        this.desc = "Give you the link to add Me to your server";
        this.func = function(bot, message, author) {
            author.sendMessage("I cannot except invite links, but you can add me at https://r3alb0t.xyz");
        }
    }
}
