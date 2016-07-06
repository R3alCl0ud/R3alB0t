var request = require("request");
var https = require("https");

var r34 = function(bot, msg) {
    try {
        url = "http://rule34.xxx/index.php?page=post&s=list&tags=" + msg.content.split(" ").slice(1).join("+");
        var id = [];
        request(url, function(error, response, html) {
            splitFile = html.split('"');
            for (var x = 0; x < splitFile.length; x++) {
                if (splitFile[x - 1] == " href=" && splitFile[x + 2].startsWith("//img.rule34.xxx/thumbnails/")) {
                    id.push(splitFile[x]);
                }
            }
            if (id.length > 0) {
                var pick = (Math.floor(Math.random() * (id.length)) + 0);
                var sending = "http://rule34.xxx/" + id[pick].split("amp;").join("");
                request(sending, function(error, response, html) {
                    var splitFile = html.split('"');
                    var bigId = "";
                    for (var x = 0; x < splitFile.length; x++) {
                        if (splitFile[x + 2] == "image") {
                            bigId = splitFile[x];
                        }
                    }
                    bot.sendMessage(msg.channel, "http:" + bigId);
                });
                sending = null;
                pick = null;
            } else {
                bot.sendMessage(msg.channel, "no results found!");
            }
        });
    } catch (err) {
        console.log(err);
    }
}

var e621 = function(bot, msg) {
    try {
        var uri = "https://e621.net/post/index/1/" + msg.content.split(" ").slice(1).join("%20");
        var id = [];
        //console.log(url)
        https.request({url: uri, headers: {'User-Agent': 'node.js'}}, function(error, response, html) {
            splitFile = html.split('"');
            for (var x = 0; x < splitFile.length; x++) {
                if (splitFile[x - 2] == "tooltip-thumb") {
                    id.push(splitFile[x]);
                    //msg.reply("http:" + splitFile[x])
                }
            }
            //console.log(id.length)
            if (id.length > 0) {
                var pick = (Math.floor(Math.random() * (id.length)) + 0);
                var sending = "https://e621.net" + id[pick];
                request({url: sending, headers: {'User-Agent': 'node.js'}}, function(error, response, html) {
                    var splitFile = html.split('"');
                    var bigId = "";
                    for (var x = 0; x < splitFile.length; x++) {
                        if (splitFile[x - 2] == "Note.toggle();") {
                            bigId = splitFile[x];
                        }
                    }
                    bot.sendMessage(msg.channel, bigId);
                });
                sending = null;
                pick = null;
            } else {
                bot.sendMessage(msg.channel, "no results found!");
            }
        });
    } catch (err) {
        console.log(err);
    }
}

exports.registerCMD = function(CommandRegistry, plugin) {

    CommandRegistry.registerPrefix(plugin, "##");
    CommandRegistry.registerCommand(plugin, 'rule34', ["rule34", "r34"], "name says it all", r34, "@everyone");
    CommandRegistry.registerCommand(plugin, 'e621', ["e621"], "name says it all", e621, "@everyone");
};
