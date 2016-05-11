var request = require("request");
var url = require("url");
var fs = require('fs');
var ytdl = require('youtube-dl');
var util = require('./util');

var downloadingPL = false;
var playlists = [];



exports.handleYTlink = function(songLink, playlistFile, usr, server) {

    var link = songLink.split("v=");
    var id = link[1];
    var size;
    var newSong = {
        "id": id,
        "title": "",
        "user": usr.id,
        "duration": 0,
        "type": "youtube"
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
        newSong.title = info.title;
        newSong.duration = util.timeToMs(info.duration.toString());
    }).pipe(fs.createWriteStream('./playlists/' + server.split(" ").join("") + '/' + id + '.mp3'));

    var pos = 0;
    video.on('data', function data(chunk) {
        pos += chunk.length;
        // `size` should not be 0 here.
        if (size) {
            var percent = (pos / size * 100).toFixed(2);
            process.stdout.cursorTo(0);
            process.stdout.clearLine(1);
            process.stdout.write(percent + '%');
            if (percent == 100) {
                console.log("\nDone Downloading!");
                //bot.sendMessage(boundChannels[Vserver], "added one song to the playlist");
                var songs = JSON.parse(fs.readFileSync(playlistFile));
                songs.tracks[songs.tracks.length] = newSong;
                fs.writeFileSync(playlistFile, JSON.stringify(songs, null, "\t"));
                songs = null;
            }
        }
    });


}

var someSong = {
    "usr": "",
    "file": "",
    "numToDownload": 0,
    "numDownloaded": 0,
    "server": ""
};

var newTracks = [];


exports.ytPlaylist = function(newPL) {
    playlists[playlists.length] = newPL;
    
    if (downloadingPL == false)
    {
        handlePL(playlists[0].url, playlists[0].usr, playlists[0].plF);
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





function handlePL(url, usr, plFile) {
    'use strict';
    if (usr != null && plFile != null) {
        newTracks = [];
        someSong.numDownloaded = 0;
        someSong.usr = usr.toString();
        someSong.file = plFile.toString();
        var server = plFile.split("/");
        someSong.server = server[2];
        console.log("got the url");
    }



    //if (songs != null)
    // someSong.server = songs.server;


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
        //console.log(info.duration);
        var newSong = {
            "id": id,
            "title": info.title,
            "user": someSong.usr,
            "duration": util.timeToMs(info.duration.toString()),
            "type": "youtube"
        };
        //console.log(newTracks.length);
        newTracks[newTracks.length] = newSong;
        var output = ["./playlists/", someSong.server, "/", id, ".mp3"].join("");
        video.pipe(fs.createWriteStream(output));
    });
    var pos = 0;
    video.on('data', function data(chunk) {
        pos += chunk.length;
        // `size` should not be 0 here.
        if (size) {
            var percent = (pos / size * 100).toFixed(2);
            process.stdout.cursorTo(0);
            process.stdout.clearLine(1);
            process.stdout.write((someSong.numDownloaded + 1) + ":" + someSong.numToDownload + " " + percent + '%');
        }

    });

    video.on('next', handlePL);

    video.on('end', function() {
        someSong.numDownloaded++;
        var songs = JSON.parse(fs.readFileSync(someSong.file));
        songs.tracks[songs.tracks.length] = newTracks[(newTracks.length - 1)];
        util.writeJSON(someSong.file, songs);
        songs = null;
        if (someSong.numDownloaded == someSong.numToDownload) {
            console.log("\nDone Downloading all the songs");
            playlists.splice(0, 1);
            if (playlists.length > 0) {
                handlePL(playlists[0].url, playlists[0].usr, playlists[0].plF);
            }
            else {
                return false;
            }
        }
    });
}