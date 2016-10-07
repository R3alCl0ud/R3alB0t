const request = require("request");
const https = require("https");
const lib = require('../../../lib');


class r34 extends lib.Command{
    constructor(plugin) {
        super("r34", null, plugin);
        this.setAlias(["rule34", "r34"]);
        this.role = "lewd";
        this.description = "names says it all";
        this.Message = function(msg) {
            try {
                var url = "http://rule34.xxx/index.php?page=post&s=list&tags=" + msg.content.split(" ").slice(1).join("+");
                var id = [];
                request(url, function(error, response, html) {
                    var splitFile = html.split('"');
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
                            msg.channel.sendMessage("http:" + bigId);
                        });
                        sending = null;
                        pick = null;
                    } else {
                        msg.channel.sendMessage("no results found!");
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }

    }
}
class e621 extends lib.Command{
    constructor(plugin) {
        super("e621", null, plugin);
        this.role = "lewd";
        this.Message = function(msg) {
            try {
                var uri = "https://e621.net/post/index/1/" + msg.content.split(" ").slice(1).join("%20");
                var id = [];
                //console.log(url)
                request({
                    url: uri,
                    headers: {
                        'User-Agent': 'node.js'
                    }
                }, function(error, response, html) {
                    var splitFile = html.split('"');
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
                        request({
                            url: sending,
                            headers: {
                                'User-Agent': 'node.js'
                            }
                        }, function(error, response, html) {
                            var splitFile = html.split('"');
                            var bigId = "";
                            for (var x = 0; x < splitFile.length; x++) {
                                if (splitFile[x - 2] == "Note.toggle();") {
                                    bigId = splitFile[x];
                                }
                            }
                            msg.channel.sendMessage(bigId)
                        });
                        sending = null;
                        pick = null;
                    } else {
                        msg.channel.sendMessage("no results found!");
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
    }
}

module.exports = class commands {

    constructor(plugin) {
        if (plugin != null) {
            this.plugin = plugin;

        }
    }

    register() {
        this.plugin.registerCommand(new r34(this.plugin))
        this.plugin.registerCommand(new e621(this.plugin));

    }
};
