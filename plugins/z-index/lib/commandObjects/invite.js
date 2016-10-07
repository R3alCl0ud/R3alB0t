const lib = require('../../../../lib');

module.exports = class invite extends lib.Command{
    constructor(plugin) {
        super("invite", false, plugin, {caseSensitive: false});
        this.setAlias(["invite"]);
        this.role = "@everyone";
        this.description = "Gives you the link to add Me to your server";
        this.Message = function(message, author) {
            author.sendMessage("I cannot except invite links, but you can add me at https://r3alb0t.xyz");
        }
    }
}
