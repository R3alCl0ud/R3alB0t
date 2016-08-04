String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};


module.exports = class help {
    constructor(plugin) {
        this.plugin = plugin || null;
        this.id = "help";
        this.names = ["help", "cmds", "halp"]
        this.func = function(bot, msg, usr, channel, server, cmdReg) {
            var helpMSG = [];
            var longest = 0;
            helpMSG.push("```swift")
            var Args = msg.content.split(' ');
            if (Args.length == 1) {
                helpMSG.push("╔════════════════════════════════════════════════════════════════════════════╗")
                if (helpMSG[helpMSG.length - 1].length > longest) longest = helpMSG[helpMSG.length - 1].length;
                helpMSG.push("║ Type: ##help <plugin> to view the commands for the plugin                  ║");
                if (helpMSG[helpMSG.length - 1].length > longest) longest = helpMSG[helpMSG.length - 1].length;
                helpMSG.push("║ Plugin: description                                                        ║");
                if (helpMSG[helpMSG.length - 1].length > longest) longest = helpMSG[helpMSG.length - 1].length;
                helpMSG.push("╠════════════════════════════════════════════════════════════════════════════╣")
                if (helpMSG[helpMSG.length - 1].length > longest) longest = helpMSG[helpMSG.length - 1].length;
                for (var plugin in cmdReg) {
                    helpMSG.push("║ " + plugin + ": " + cmdReg[plugin].description + " ║");
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
                bot.sendMessage(channel, helpMSG);
            } else {
                if (cmdReg.hasOwnProperty(Args[1])) {
                    helpMSG.push("╔═╗")
                    helpMSG.push("║ command: description                                       ║")
                    if (helpMSG[helpMSG.length - 1].length > longest) longest = helpMSG[helpMSG.length - 1].length;
                    helpMSG.push("╠════════════════════════════════════════════════════════════╣")
                    if (helpMSG[helpMSG.length - 1].length > longest) longest = helpMSG[helpMSG.length - 1].length;
                    for (var cmd in cmdReg[Args[1]].cmds) {
                        var prefix = cmdReg[Args[1]].prefixes.get("server", server.id);

                        if (prefix == null) {
                            prefix = cmdReg[Args[1]].prefixes.get("server", "Global");
                        }

                        prefix = prefix.prefix

                        helpMSG.push("║ " + prefix + cmd + ": " + cmdReg[Args[1]].cmds[cmd].desc + ", Aliases: " + cmdReg[Args[1]].cmds[cmd].names.join(", ") + " ║");
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
                }

                helpMSG.push('```');
                bot.sendMessage(msg.channel, helpMSG);
            }

        }
        this.role = "@everyone"
    }
}
