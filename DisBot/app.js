//include discord

var Discord = require("discord.js");
var opus = require('node-opus');
var request = require("request");
var url = require("url");


var bot = new Discord.Client();



var boundChannel = false;
var currentStream = false;

var playlist = [];
var pli = -1;

// Video that is currently being played
var currentVideo = false;

// Last video played
var lastVideo = false;

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


bot.loginWithToken(AuthDetails.token);

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
			var fourchan = msg.channel;
			bot.sendMessage(fourchan, [
					"**~means it requires user to be on admin list~**",
					"Available commands are:",
					"`##help:` Displays the list of commands",
					"`##slap:` Hit a user with a random object",
					"`##soundcloud <link to song>:` adds a song from soundcloud to the music playlist",
					"`##skip:` skips current song",
					"`##pause:` stop playing music",
					"`##join <voice channel>:` joins a voice channel",
					"`##play:` starts/resumes playing music"].join("\n"));

            console.log("The user " + msg.author.username.toString() + " used the help command");
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


        if (msg.content.startsWith("join")) {
        	var channeltoJoin = msg.content.split(" ").slice(1).join(" ");
        	var channels = msg.channel.server.channels;
        	for (var channel of channels) {
        		if (channel instanceof Discord.VoiceChannel) {
        			if (!channeltoJoin || channel.name === channeltoJoin) {
        				bot.joinVoiceChannel(channel);
        				console.log("joined voice channel: " + channeltoJoin + " in server: " + msg.channel.server.toString());
        			}
        		}
        	}
        }

        if (msg.content == "leavevoice")
        {
        	try {
        		bot.voiceConnection.destroy();
        	} catch (err) {
        		bot.reply("noot! noot!");
        	}
        }

        if (msg.content.startsWith("soundcloud")) {
        	var body;
        	var info;
        	request("http://api.soundcloud.com/resolve.json?url=" + msg.content.split(" ").slice(1).join(" ") + "&client_id=71dfa98f05fa01cb3ded3265b9672aaf", function (error, response, body) {

        			body = JSON.parse( body );

        			if (body.kind == "track")
        			{
        				playlist.push(body);
        			}
        			if (body.kind == "playlist")
        			{
        				for (var i = 0; i < body.tracks.length; i++)
        				{
        					var song = body.tracks[i];
        					playlist.push(song);
        					console.log(song.title +" added by: " + msg.author.username);
        				}
        				
        			}

        	});
        }

        if (msg.content.startsWith("youtube")) {
        	var video = msg.content.split(" ").slice(1);

        	bot.voiceConnection.playRawStream(request(video));
        }

        if (msg.content == "play")
        {
        	playNext(bot);
        }
        
        if (msg.content == "skip")
        {
        	playlist.splice(0, 1);
        	playNext(bot);
        }

        if(msg.content.startsWith("pause")) {
        	bot.voiceConnection.stopPlaying();

        }
        
        if (msg.content.startsWith("volume"))
        {
        	var volume = msg.content.split(" ").slice(1).join(" ") / 100;
        	try
        	{
        		bot.voiceConnection.setVolume();
        		bot.sendMessage(msg.channel, "Volume set to: " + volume);
        	}
        	catch (err) 
        	{
        		bot.sendMessage(msg.channel, "Put me in a voice channel first!");
        	}
        	console.log("The user " + msg.author.username.toString() + " used the volume command");
        	console.log("Volume set to " + volume);
        }

});


function playNext(bot){

        console.log("playlist length: " + playlist.length);
		    play(bot, playlist[0]);
}

function playStop(bot) {
	if(bot.voiceConnection){
		bot.voiceConnection.stopPlaying();
		currentVideo = false;
		playNext(bot);
	}
}
function play(bot, info) {
	var body = info;

	currentStream = request("http://api.soundcloud.com/tracks/" + body.id + "/stream?consumer_key=71dfa98f05fa01cb3ded3265b9672aaf");
	bot.setPlayingGame(body.title);
	try {
		bot.voiceConnection.playRawStream(currentStream);
		console.log("Song: " + body.title + ", now playing");
	} catch (err) {
		//bot.reply(msg, "Put me in a voice channel first.");
    console.log("What the fuck happened");
	}
	currentStream.on('end', function () {
			setTimeout(function() { playStop(bot); }, 16100);
			playlist.splice(0, 1);
	});
}
