"use strict";

var DiscordJS = require('discord.js');

class mpegPlayer {

    constructor(session) {
        if (session instanceof DiscordJS)
        {
            this.session = null;
            this.bot = bot;
            this.ready = true;
        } else {
            console.log("No session found, Attempting to login");
            this.session = session;
            this.bot = null;
            this.ready = false;
        }

        this.keys {
            soundcloud: null
        };

        login(information) {
            if (this.bot == null && this.session !=null) {
                this.bot = new DiscordJS.Client();
                if (this.session.hasOwnProperty('token')) {
                    this.bot.loginWithToken(this.session);
                }
            }
        }



        //this.server = server;
    }
}
