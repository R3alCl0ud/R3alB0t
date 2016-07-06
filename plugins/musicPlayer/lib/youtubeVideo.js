"use strict";

var lib = require('../../../lib');
var ytdl = require('ytdl-core');

class Video {
    constructor(video, user) {
        this.user = user.id;
        this.video = video.replace("https://", "http://");
        this.title = "";
        this.url = null;
        this.loaded = false;
    }

    loadData() {
        if(this.loaded) return;
        ytdl.getInfo(this.video, function(error, info) {
            if (error != null) {
                console.log(error);
            } else {
                this.title = info.title;
                this.url = info.loaderUrl;
                this.loaded = true;
            }
        }.bind(this));
    }
}


module.exports = Video;
