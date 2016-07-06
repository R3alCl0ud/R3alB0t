var request = require("request");
var url = require("url");
var fs = require('fs');
var ytdl = require('youtube-dl');
var util = require('./util');
var readline = require('readline');
var mysql = require('mysql');


var downloadingPL = false;
var playlists = [];

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'B3$tP4$$',
	database : 'discordBot'
});


exports.handleYTlink = function(songLink, server_id, usr) {

    var link = songLink.split("v=");
    var id = link[1];
    var size;
	newSong = {
		position: 0,
		song_id: "",
		song_name: "",
		song_dur: "",
        usr_id: usr.id,
		usr_name: usr.username,
		song_type: "YouTube"
	};

    //console.log(id);

    var video = ytdl(songLink,
        // Optional arguments passed to youtube-dl.
        ['--format=bestaudio'],
        // Additional options can be given for calling `child_process.execFile()`.
        {
            cwd: __dirname
        });

    // Will be called when the download starts.
    video.on('info', function(info) {
        size = info.size;
        //console.log(info);
        console.log('Download started');
        //console.log(info);
        newSong.song_name = info.title;
        newSong.song_dur = util.timeToMs(info.duration.toString());
		newSong.song_id = info.id
    }).pipe(fs.createWriteStream('./playlists/' + server_id + '/' + newSong.song_id + '.mp3'));

    var pos = 0;
    video.on('data', function data(chunk) {
        pos += chunk.length;
        // `size` should not be 0 here.
        if (size) {
            var percent = (pos / size * 100).toFixed(2);
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(percent + '%');
            if (percent == 100) {
                console.log("\nDone Downloading!");
                //bot.sendMessage(boundChannels[Vserver], "added one song to the playlist");
                songs = null;
            }
        }
    });

	video.on('end', function() {
		connection.query('INSERT INTO ?? SET ?', ["'" + server_id.toString() + "'", newSong], function(err, result) {
			if (err) throw err;
		});
	});

}

var someSong = {
    "usr_id": "",
    "usr_name": "",
    "numToDownload": 0,
    "numDownloaded": 0,
    "server": ""
};

var newTracks = [];


exports.ytPlaylist = function(newPL) {
    playlists[playlists.length] = newPL;

    if (downloadingPL == false)
    {
        handlePL(playlists[0].url, playlists[0].usr, playlists[0].id);
        downloadingPL = true;
    }
    return playlists.length;

}

exports.isDownloading = function() {
    if (downloadingPL == false) {
        return false;
    }
    else {
        return true;
    }
}



var newSong;

function handlePL(url, usr, server_id) {
    'use strict';
    if (usr != null) {
        someSong.numDownloaded = 0;
        someSong.usr_id = usr.id;
        someSong.usr_name = usr.name;
        someSong.server = server_id;
        console.log("got the url");

    }

    var video = ytdl(url, ['--format=bestaudio']);
    var id = "";
    video.on('error', function error(err) {
        console.log('error 2:', err);
    });


    var size = 0;
    video.on('info', function(info) {
        //console.log(info.n_entries);
        someSong.numToDownload = info.n_entries;
        size = info.size;
        id = info.id;
   		newSong = {
			position: 0,
			song_id: info.id.toString(),
			song_name: info.title,
			song_dur: util.timeToMs(info.duration.toString()),
            usr_id: someSong.usr_id,
			usr_name: someSong.usr_name,
			song_type: "YouTube"
		};
        var output = ["./playlists/", someSong.server, "/", id, ".mp3"].join("");
        video.pipe(fs.createWriteStream(output));
    });
    var pos = 0;
    video.on('data', function data(chunk) {
        pos += chunk.length;
        // `size` should not be 0 here.
        if (size) {
            var percent = (pos / size * 100).toFixed(2);
			//readline.clearLine();
            readline.cursorTo(process.stdout, 0);
            process.stdout.write((someSong.numDownloaded + 1) + ":" + someSong.numToDownload + " " + percent + '%');
        }
    });

    video.on('next', handlePL);

    video.on('end', function() {
        someSong.numDownloaded++;
		connection.query('INSERT INTO ?? SET ?', ["'" + someSong.server + "'", newSong], function(err, result) {
			if (err) throw err;
		});
        if (someSong.numDownloaded == someSong.numToDownload) {
            console.log("\nDone Downloading all the songs");
            playlists.splice(0, 1);
            if (playlists.length > 0) {
                handlePL(playlists[0].url, playlists[0].usr, playlists[0].id);
            }
            else {
                downloadingPL = false;
            }
        }
    });
}
