String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};


module.exports = class help {
    constructor(plugin) {
        this.plugin = plugin || null;
        this.id = "help";
        this.names = ["help", "commands", "halp"]
        this.func = function(bot, msg, usr, channel, server, cmdReg) {
            var helpMSG = [];
            var longest = 0;

            var Args = msg.content.split(' ');
            if (Args.length == 1) {
                helpMSG.push("```ruby")
                helpMSG.push("╔════════════════════════════════════════════════════════════════════════════╗")
                if (helpMSG[helpMSG.length - 1].length > longest) longest = helpMSG[helpMSG.length - 1].length;
                helpMSG.push("║ Type: ##help <plugin> to view the commands for the plugin                  ║");
                if (helpMSG[helpMSG.length - 1].length > longest) longest = helpMSG[helpMSG.length - 1].length;
                helpMSG.push("║ Plugin: description                                                        ║");
                if (helpMSG[helpMSG.length - 1].length > longest) longest = helpMSG[helpMSG.length - 1].length;
                helpMSG.push("╠════════════════════════════════════════════════════════════════════════════╣")
                if (helpMSG[helpMSG.length - 1].length > longest) longest = helpMSG[helpMSG.length - 1].length;
                for (var plugin in cmdReg.plugins) {
                    if (typeof cmdReg.plugins[plugin] !== "object") continue;
                    var serverPrefix = cmdReg.plugins[plugin].prefixes.get("server", server.id) || cmdReg.plugins[plugin].prefixes.get("server", "Global") || {prefix: "##"}
                    helpMSG.push("║ " + cmdReg.plugins[plugin].name + ": " + cmdReg.plugins[plugin].description + ", Prefix: " + serverPrefix.prefix + " ║");
                    if (helpMSG[helpMSG.length - 1].length > longest) longest = helpMSG[helpMSG.length - 1].length;
                }
                var lastline = "╚═╝";
                helpMSG.push(lastline)
                for (var line in helpMSG) {
                    if (line == 0) {
                        var sentence = helpMSG[line];
                        while (sentence.length < longest) {

                            sentence = sentence.splice(sentence.length - 2, 0, "╗");


                        }
                    }

                    if (line <= 2) continue;

                    var sentence = helpMSG[line];

                    if (line <= helpMSG.length - 2) {
                        while (sentence.length < longest) {
                            sentence = sentence.splice(sentence.length - 2, 0, " ");
                        }
                    }
                    if (line == helpMSG.length - 1) {
                        while (sentence.length < longest) {
                            sentence = sentence.splice(1, 0, "═");
                        }
                    }
                    helpMSG[line] = sentence;
                }

                helpMSG.push("```");
                channel.sendMessage(helpMSG.join('\n'));
            } else {
                if (cmdReg.plugins.has("id", Args[1])) {

                    var plugin = cmdReg.plugins.get("id", Args[1]);


                    helpMSG.push("```ruby")
                    helpMSG.push("╔═╗")
                    helpMSG.push("║ command: description                                       ║")
                    if (helpMSG[helpMSG.length - 1].length > longest) longest = helpMSG[helpMSG.length - 1].length;
                    helpMSG.push("╠════════════════════════════════════════════════════════════╣")
                    if (helpMSG[helpMSG.length - 1].length > longest) longest = helpMSG[helpMSG.length - 1].length;
                    for (var cmd in plugin.commands) {

                        if (typeof plugin.commands[cmd] !== "object") continue;

                        if (plugin.commands[cmd].server != server.id && plugin.commands[cmd].server !== "Global") continue;

                        helpMSG.push("║ " + plugin.commands[cmd].id + ": " + plugin.commands[cmd].desc + ", Aliases: " + plugin.commands[cmd].names.join(", ") + " ║");
                        if (helpMSG[helpMSG.length - 1].length > longest) longest = helpMSG[helpMSG.length - 1].length;
                    }
                    var lastline = "╚═╝";
                    helpMSG.push(lastline)
                    for (var line in helpMSG) {
                        var sentence = helpMSG[line];
                        if (line == 0) continue;

                        if (line == 1) {

                            while (sentence.length < longest) {
                                sentence = sentence.splice(1, 0, "═");
                            }
                            helpMSG[line] = sentence;
                            continue;
                        }

                        if (line == 3) {
                            while (sentence.length < longest) {
                                sentence = sentence.splice(1, 0, "═");
                            }
                            helpMSG[line] = sentence;
                            continue;
                        }

                        if (line == 2) {
                            while (sentence.length < longest) {
                                sentence = sentence.splice(sentence.length - 2, 0, " ");
                            }
                            helpMSG[line] = sentence;
                            continue;
                        }

                        if (line <= helpMSG.length - 2) {
                            while (sentence.length < longest) {
                                sentence = sentence.splice(sentence.length - 2, 0, " ");
                            }
                        }
                        if (line == helpMSG.length - 1) {
                            while (sentence.length < longest) {
                                sentence = sentence.splice(1, 0, "═");
                            }
                        }
                        helpMSG[line] = sentence;
                    }
                    helpMSG.push('```');
                }

                channel.sendMessage(helpMSG.join('\n'));
            }

        }
        this.role = "@everyone"
    }
}
