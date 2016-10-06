var lib = require("../../../lib");
var fs = require('fs');
var request = require('request');
let opus = require('node-opus');


class iPod {
    constructor(voiceConnection, channel, data) {
        this.id = data ? data.server : voiceConnection.channel.guild.id
        this.voiceConnection = voiceConnection;
        this.voiceChannel = voiceConnection.channel;
        this.boundChannel = channel;
        this.playingMessage = null;
        this.paused = data ? data.paused : false;
        this.plFile = `./playlists/${String(this.id)}/${String(this.id)}.json`;
        this.currentTime = data ? data.currentTime || 0 : 0;
        this.volume = data ? data.volume : 0.1;
        this.keys = {
            soundcloud: "3b16b5507608db3eaace81f41aea90bb"
        };
        this.Role = data ? data.Role : "@everyone";
        this.autoStart = data ? data.autoStart : true;

        this.triggered = false;

        this.voiceConnection.on('error', (error) => console.log("connection: ", error));
        this.voiceConnection.player.on('error', (error) => console.log("player: ", error));

    }

    destroy() {
        if (this.dispatcher && !this.paused)
            this.currentTime += this.dispatcher.time / 1000;
        
        if (this.playingMessage) this.playingMessage.delete()
        const playlist = lib.openJSON(this.plFile)
        playlist.paused = this.paused
        playlist.currentTime = this.currentTime || 0
        lib.writeJSON(this.plFile, playlist);
        
        this.triggered = true;
        this.voiceConnection.disconnect();
    }

    pause() {
        if (this.paused) return;
        if (!this.voiceConnection.player.speaking) return;
        if (this.playingMessage) this.playingMessage.delete()
        
        this.stream.pause()
        
        this.currentTime += this.dispatcher.time / 1000;
        this.dispatcher.pause()
        this.paused = true;
        const playlist = lib.openJSON(this.plFile)
        playlist.paused = this.paused
        playlist.currentTime = this.currentTime || this.dispatcher.time
        lib.writeJSON(this.plFile, playlist);
    }

    resume() {
        if (!this.paused) return;
        if (this.voiceConnection.player.speaking) return;
        this.stream.resume()
        this.dispatcher.resume()
        this.paused = false;
        const playlist = lib.openJSON(this.plFile)
        playlist.paused = this.paused;
        lib.writeJSON(this.plFile, playlist);
    }
    
    skip() {
        if (this.paused) return;
        if (!this.stream) return;
        if (!this.dispatcher) return;
        if (this.playingMessage) this.playingMessage.delete()
        
        
        this.stream.abort()
        this.stream = null;
        this.dispatcher.end()

    }

    setVolume(volume) {
        this.volume = volume;
        this.dispatcher.setVolume(this.volume)
    }

    play(stream) {
        stream.on('error', e => console.log('help', e));
        this.stream = stream
        this.dispatcher = this.voiceConnection.playStream(this.stream, {
            seek: this.currentTime,
            volume: this.volume,
            passes: 5
        })
        this.paused = false;
        this.dispatcher.once('end', this.songEnd.bind(this))
        this.dispatcher.on('error', (error) => console.log("dispatcher: ", error))

    }

    stopPlaying() {
        setTimeout(() => {
            if (this.paused) return;
            this.dispatcher ? this.dispatcher.pause() : ""
            this.currentTime = 0;
            this.playingMessage.delete();
        }, 500)
    }

    songEnd() {
        setTimeout(() => {
            if (this.triggered) return;
            if (this.playingMessage) this.playingMessage.delete()
            this.dispatcher = null;
            this.currentTime = 0;
            const playlist = lib.openJSON(this.plFile)
            if (playlist.tracks.length > 0)
                playlist.tracks.splice(0, 1);
                playlist.currentTime = 0;
            lib.writeJSON(this.plFile, playlist);
            this.playNext()
        }, 1000)

    }

    playNext() {
        
        if (this.paused) {
            this.resume()
            return;
        }
        const playlist = lib.openJSON(this.plFile)
        if (playlist.tracks.length < 1) return;

        const song = playlist.tracks[0];

        if (this.currentTime > song.duration / 1000) this.currentTime = 0
        
        if (this.triggered) return;
        if (this.voiceConnection.player.speaking) return;



        if (song.type === "soundcloud") {
            const stream = request(`http://api.soundcloud.com/tracks/${song.id}/stream?client_id=${this.keys.soundcloud}`)
            this.play(stream);
        }
        else {
            this.play(request(song.url))
        }

        this.boundChannel.sendMessage(`**Now Playing: ${song.title}**`).then(message => {
            console.log(message.content)
            this.playingMessage = message;
        }).catch(console.log)
    }

}

module.exports = iPod;