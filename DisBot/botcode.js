//include discord
var stdin = process.openStdin();
var send = "";
var get = "";
var Discord = require("discord.js");
var bot = new Discord.Client();
var fullmsg = "";
var i = 0;
var x = 0;
var d = "";


var fs = require('fs');
var array = fs.readFileSync('file.txt').toString().split("\n");
for (i in array) {
    console.log(array[i]);
}

stdin.addListener("data", function (d) {
    if (d.toString().trim().startsWith("join")) {
        bot.joinServer(d.toString().trim().split(" ").slice(1).join(" "));
    }
})
// Get the email and password
var AuthDetails = require("./auth.json");


bot.login(AuthDetails.email, AuthDetails.password);

//when the bot is ready
bot.on("ready", function () {
    console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
    console.log([
        "I am connected/have access to:",
			`$ { bot.servers.length } servers`,
			`$ { bot.channels.length } channels`,
			`$ { bot.users.length } users`,
].join("\n"))
});

//when the bot disconnects
bot.on("disconnected", function () {
    //alert the console
    console.log("Disconnected!");
    
    //exit node.js with an error
    process.exit(1);
});

//when the bot receives a message
bot.on("message", function (msg) {
    if (!msg.content.startsWith("$WYB$")) return;
    
    msg.content = msg.content.substr(5);
    
    console.log(msg.author.username.toString() + " sent command: " + msg.content)
    
    if (msg.content === "stats") {
        msg.reply([
            "I am connected/have access to:",
			`$ { bot.servers.length } servers`,
			`$ { bot.channels.length } channels`,
			`$ { bot.users.length } users`,
		].join("\n"));
	}
    
    if (msg.content.startsWith("say")) {
        send = msg.content.split(" ").slice(1).join(" ");
        if (msg.author.username.toString() == "wagyourtail") {
            bot.deleteMessage(msg);
        }
        bot.sendMessage(msg.channel, send);
    }
    
    if (msg.content == "ping") {
        msg.reply(["PONG!"]);
    }
    
    if (msg.content.startsWith("spam")) {
        if (msg.author.username.toString() == "wagyourtail") {
            console.log(msg.content.split(" ").slice(1).join(" "));
            console.log(parseInt(msg.content.split(" ").slice(2).join(" ")));
            for (i = 0; i <= parseInt(msg.content.split(" ").slice(2).join(" ")); i++) {
                bot.sendMessage(msg.channel, msg.content.split(" ").slice(1).join(" ") + i);
            }
        }
    }
    if (msg.content.startsWith("play")) {
        if (array.indexOf(msg.author.username.toString()) != -1) {
            //if (msg.author.username.toString() == "R3alCl0ud" || msg.author.username.toString() == "wagyourtail"){
            bot.deleteMessage(msg);
            var game = msg.content.split(" ").slice(1).join(" ");
            bot.setPlayingGame(game);
        } else {
            msg.reply(["You do not have permission to use this command, wrong role"]);
        }

    }
    if (msg.content.startsWith("poke")) {
        console.log("@" + msg.author.username.toString() + " poked " + msg.content.split(" ").slice(1).join(" "));
        bot.sendTTSMessage(msg.channel, msg.author + " poked " + msg.content.split(" ").slice(1).join(" "));
    }
    if (msg.content.startsWith("AddMin")) {
        if (array.indexOf(msg.author.username.toString()) != -1) {
            x = array.legnth;
            array[x] = msg.content.split(" ").slice(1).join(" ");
            fs.appendFile("file.txt", "\n" + array[x]);
            msg.reply(" successfully added: " + msg.content.split(" ").slice(1).join(" "));
            console.log(msg.author.username.toString() + "successfully added: " + msg.content.split(" ").slice(1).join(" "))
        } else {
            console.log(msg.author.username.toString() + "unsuccessfully tried to add: " + msg.content.split(" ").slice(1).join(" "))
            msg.reply(" warning you tried to add: " + msg.content.split(" ").slice(1).join(" ") + " but don't have perms! do it again and an admin will be notified")
        }
    }
    if (msg.content.startsWith("String")) {
        msg.reply(msg.content.split(" ").slice(1).join(" "))
        msg.reply(msg.author.id)
    }
	//if (msg.content.startsWith("WA")) {
	//	wolfram_plugin.respond(msg.content.split(" ").slice(1).join(" "),msg.channel,bot)
	//}

});




