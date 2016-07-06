var fs = require('fs');
var request = require('request');
var util = require('./util');


exports.handleSClink = function(songLink, server_id, usr, scKey) {

    var newSong = {};
    try {

        request("http://api.soundcloud.com/resolve.json?url=" + songLink + "&client_id=" + scKey, function(error, response, body) {
            var songs = util.openJSON(playlistFile);

            body = JSON.parse(body);
            if (body.kind == "track") {
                console.log(body.title + " added by: " + usr.username);
                newSong = {
                    position: 0,
                    song_id: body.id.toString(),
                    song_name: body.title,
                    song_dur: body.duration,
                    usr_id: usr.id,
                    usr_name: usr.username,
                    song_type: "SoundCloud"
                };
                songs.tracks[songs.tracks.length] = newSong;
            }
            if (body.kind == "playlist") {
                for (var i = 0; i < body.tracks.length; i++) {
                    newSong = {
                        position: 0,
                        song_id: body.tracks[i].id.toString(),
                        song_name: body.tracks[i].title,
                        song_dur: body.tracks[i].duration,
                        usr_id: usr.id,
                        usr_name: usr.username,
                        song_type: "SoundCloud"
                    };
                }
            }
            util.writeJSON(playlistFile, songs);
            songs = null;
        });
    } catch (err) {
        console.log(err);
    }
}
