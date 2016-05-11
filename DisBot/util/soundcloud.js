var fs = require('fs');
var request = require('request');
var util = require('./util');


exports.handleSClink = function (songLink, playlistFile, usr, scKey) {

    var newSong = {};


    try {
        
        request("http://api.soundcloud.com/resolve.json?url=" + songLink + "&client_id=" + scKey, function(error, response, body) {
            var songs = util.openJSON(playlistFile);
            var songsNum = songs.tracks.length;

            body = JSON.parse( body );

            if (body.kind == "track") {
                console.log(body.title + " added by: " + usr.username);
                newSong = {
                    "id": body.id,
                    "title": body.title,
                    "user": usr.id,
                    "duration": body.duration,
                    "type": "soundcloud"
                };
                songs.tracks[songs.tracks.length] = newSong;
            }

            if (body.kind == "playlist") {
                for (var i = 0; i < body.tracks.length; i++) {
                    newSong = {
                        "id": body.tracks[i].id,
                        "title": body.tracks[i].title,
                        "user": usr.id,
                        "duration": body.tracks[i].duration,
                        "type": "soundcloud"
                    };
                    songs.tracks[songs.tracks.length] = newSong;
                }
            }
            util.writeJSON(playlistFile, songs);
            songs = null;
        });
    }
    catch (err) {
        console.log(err);
    }
}
