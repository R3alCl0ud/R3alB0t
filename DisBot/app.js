//include discord

var Discord = require("discord.js");
//var opus = require('node-opus');
var bot = new Discord.Client();
var i = 0;
var x = 0;
var d = "";
var fs = require('fs');

var admins = "";

var array = fs.readFileSync('file.txt').toString().split("\n");
for (i in array) {
    if (i == 0) {
        admins = admins + "" + array[i];
    } else {
        admins = admins + ", " + array[i];
    }
}
console.log("Users in admins: " + admins);

// Get the email and password
var AuthDetails = require("./auth.json");


bot.login(AuthDetails.email, AuthDetails.password);

//when the bot is ready
bot.on("ready", function () {
    console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
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
    
    
    var dm = msg.channel.isPrivate;
      
    if (msg.content.startsWith("https://discord.gg/") && dm) {
        bot.joinServer(msg.content);
        console.log("joined a new server");
    }
    
    if (!msg.content.startsWith("##")) return;
    var usr = msg.author;
    
    msg.content = msg.content.substr(2);

    
    
    if (msg.content.startsWith("admin")) {
        if (array.indexOf(("<@" + msg.author.toString() + ">") != -1)) {
            x = array.legnth;
            array[x] = msg.content.split(" ").slice(1).join(" ");
            fs.appendFile("file.txt", "\n" + array[x]);
            msg.reply(" successfully added: " + msg.content.split(" ").slice(1).join(" "));
            console.log(msg.author.id.toString() + " successfully added: " + msg.content.split(" ").slice(1).join(" "));
        } else {
            console.log(msg.author.toString() + " unsuccessfully tried to add: " + msg.content.split(" ").slice(1).join(" "));
            msg.reply(" warning you tried to add: " + msg.content.split(" ").slice(1).join(" ") + " but don't have perms! do it again and an admin will be notified");
        }
    }
    
    if (msg.content == "help") {
        bot.sendMessage(msg.channel, [
            "Available commands are",
            "```##ping",
            "##help",
            "##slap```",
        ].join("\n"));
        console.log("The user " + msg.author.username.toString() + " used the help command");
    }
    
    if (msg.content == "ping") {
        msg.reply(["PONG!"]);
        console.log("The user " + msg.author.username.toString() + " used the pong command");
    }
    
    if (msg.content.startsWith("play")) {
        if (array.indexOf( ("@" + msg.author.username.toString()) != -1 && dm)) {
            var game = msg.content.split(" ").slice(1).join(" ");
            bot.setPlayingGame(game);
            console.log("The user " + msg.author.toString() + " used the play command");
        } else {
            msg.reply("You do not have permission to use this command and/or this is not private messages");
            console.log("The user " + msg.author.toString() + " tried to use the play command");
        }

		
    }
    
    if (msg.content.startsWith("ttssay") && array.indexOf(msg.author.username.toString()) != -1) {
        bot.sendTTSMessage(msg.channel, msg.content.split(" ").slice(1).join(" "));
        console.log("The user " + msg.author.username.toString() + " tried to use the say command");
    }
    
    if (msg.content == "test") {
        if (!msg.channel.isPrivate) {
            bot.sendMessage(msg.channel, "Thank you for choosing Cl0ud Air. Have a nice flight");
            console.log(usr.id.toString());
        } else {
            bot.sendMessage(msg.channel, "This command can not be used in private chat");
        }
    }
    
    if (msg.content.startsWith("say")) {
        bot.sendMessage(msg.channel, msg.content.split(" ").slice(1).join(" "));
        console.log("The user " + msg.author.username.toString() + " tried to use the say command");
    }
    
    if (msg.content == "stats") {
        msg.reply([
            "I am connected/have access to:",
            bot.servers.length + " servers",
            bot.channels.length + " channels",
            bot.users.length + " users",
        ].join("\n"));
        console.log("The user " + msg.author.username.toString() + " tried to use the stats command");
    }
    
    if (msg.content.startsWith("slap")) {
        var randNumMin = 0;
        var randNumMax = 8;
        var pick = (Math.floor(Math.random() * (randNumMax - randNumMin + 1)) + randNumMin);
        var fish = ["clown fish", "sword fish", "shark", "sponge cake", "blue berry pie", "banana", "poptart", "the blunt of a sword", "websters dicitonary: hardcopy"];
        bot.sendMessage(msg.channel, msg.content.split(" ").slice(1).join(" ") + " got slapped with a " + fish[pick] + " by " + msg.author.toString());
    }
    if (msg.content.startsWith("stop")) {
        if (dm) {
            console.log("Disconnected by dm!");
            
            //exit node.js with an error
            process.exit(1);
        } else {
            channel = msg.channel;
            bot.deleteMessage(msg)
            bot.sendMessage(channel, "nothing");
        }
    }
});