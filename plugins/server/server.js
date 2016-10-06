var express = require('express'),
    session = require('express-session'),
    passport = require('passport'),
    Strategy = require('passport-discord').Strategy,
    server = express();

var Plugin = require('../../lib/registry/models/plugin');
var bodyParser = require('body-parser')
let DiscordJS = require('discord.js');
var lib = require('../../lib');
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
var under = require('./public/js/underscore-min');
var request = require('request');
var Auth = require('../../options.json').Auth
var customCommand = require('./lib/command')
var customPlugin = require('./lib/customCommands');
var guild = require('./lib/guild')
var async = require('async');
var redis = require('redis');
var db = redis.createClient();

db.on("error", (err) => {
    console.log("Redis Error" + err)
});

db.on("ready", () => {
    console.log("DB is ready")
})


function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();

    res.redirect('/bot');
}

function checkServer(req, res) {

    if (bot.servers.has("id", req.guild)) return;

    res.redirect("https://discordapp.com/oauth2/authorize?&client_id=" + Auth.clientID + "&scope=bot&permissions=3148800&guild=" + req.guild + "&response_type=code&redirect_uri=https://beta.r3alb0t.xyz/servers");
}

function checkGuild(guildId, user) {

    for (var i = 0; i < user.guilds.length; i++) {
        if (user.guilds[i].id == guildId && (((user.guilds[i].permissions >> 5) & 1) == 1)) {
            return;
        }
        else if (user.guilds[i].id == guildId && (((user.guilds[i].permissions >> 5) & 1) == 0)) {
            break;
        }
    }
    res.redirect('/servers');
}



function addCustom(bot) {
    if (!fs.existsSync("./commands.json")) {
        var baseJSON = {
            servers: new DiscordJS.Cache()
        }
        lib.writeJSON('./commands.json', baseJSON)
    }



}

function errorHandler(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.ejs', {
        message: err.message,
        error: err,
        user: req.user
    });
}

function catch404(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}



function start(bot, registry) {

    var app = server.listen(3300);

    server.use(bodyParser.json()); // support json encoded bodies
    server.use(bodyParser.urlencoded({
        extended: true
    })); // support encoded bodies

    var io = require('socket.io').listen(app);

    server.set('view engine', 'ejs');

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    var scopes = ['identify', 'guilds'];
    passport.use(new Strategy({
        clientID: Auth.clientID,
        clientSecret: Auth.clientSecret,
        callbackURL: 'https://beta.r3alb0t.xyz/bot/callback',
        scope: scopes
    }, function(accessToken, refreshToken, profile, cb) {
        process.nextTick(function() {
            return cb(null, profile);
        });
    }));

    server.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
    }));

    server.use(passport.initialize());
    server.use(passport.session());
    server.get('/bot', passport.authenticate('discord', {
        scope: scopes
    }), function(req, res) {});
    server.get('/bot/callback',
        passport.authenticate('discord', {
            failureRedirect: '/'
        }),
        function(req, res) {
            res.redirect('/bot/info')
        } // auth success
    );
    server.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    server.get('/bot/info', checkAuth, function(req, res) {
        res.statusCode = 302;
        res.setHeader('Location', 'https://beta.r3alb0t.xyz/servers');
        res.end();

    });

    server.get('/bot/home', (req, res) => {
        res.statusCode = 302;
        res.setHeader('Location', 'https://beta.r3alb0t.xyz/');
        res.end();
    });



    server.param('id', (req, res, next, id) => {
        req.user_id = id;
        next();
    });

    server.use(express.static('views'));


    server.get('/', function(req, res) {
        // console.log(passport.instance);
        res.render('index.ejs', {
            user: req.user
        });
    });
    server.get('/features', function(req, res) {
        res.render('features.ejs', {
            user: req.user
        });
    });

    server.get('/servers/:id', checkAuth, function(req, res) {

        var user_info = {};
        var AdminGuild = [];
        for (var i = 0, n = 0; i < req.user.guilds.length; i++) {
            if (req.user.guilds[i].owner == true || (((req.user.guilds[i].permissions >> 5) & 1) == 1)) {
                AdminGuild[n] = req.user.guilds[i];
                n++;
            }
        }
        user_info.guilds = under.sortBy(AdminGuild, "name");

        res.render('servers.ejs', {
            user: req.user,
            guilds: user_info.guilds
        });
    });

    server.get('/servers', checkAuth, function(req, res) {
        if (req.query.guild != null) {
            var guild = {
                url: 'https://discordapp.com/api/guilds/' + req.query.guild,
                headers: {
                    'Authorization': 'Bot ' + Auth.token
                }
            };
            res.redirect('/terminal/' + req.query.guild);
        }
        else {
            res.redirect('/servers/' + req.user.id);
        }
    });

    server.param('guild', function(req, res, next, guild) {
        req.guild = guild;
        next();
    });

    server.get('/terminal/:guild', checkAuth, function(req, res) {

        var results = [];

        var Guild = {};

        if (!bot.servers.has("id", req.guild)) {
            res.redirect("https://discordapp.com/oauth2/authorize?&client_id=" + Auth.clientID + "&scope=bot&permissions=3148800&guild=" + req.guild + "&response_type=code&redirect_uri=https://beta.r3alb0t.xyz/servers");

        }
        else {
            var theGuild = bot.servers.get("id", req.guild);
            if (theGuild.icon != null) {
                Guild.icon = "https://discordapp.com/api/guilds/" + req.guild + "/icons/" + theGuild.icon + ".jpg";
            }
            else {
                Guild.icon = "https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png";
            }
            Guild.name = theGuild.name;
            res.render('terminal.ejs', {
                user: req.user,
                guild: Guild.name,
                icon: Guild.icon,
                guildID: req.guild,
                playlist: -1,
                addon: ""
            });
        }
    });

    server.get('/terminal/:guild/music', checkAuth, function(req, res) {

        var guild = {
            url: 'https://discordapp.com/api/guilds/' + req.guild + '/channels',
            headers: {
                'Authorization': 'Bot ' + Auth.token
            }
        };

        var channels;
        var textChnls = [];
        var voiceChnls = [];
        request(guild, function(error, response, body) {
            channels = JSON.parse(body);
            for (var i = 0; i < channels.length; i++) {
                if (channels[i].type == "voice")
                    voiceChnls[voiceChnls.length] = channels[i];
                else
                    textChnls[textChnls.length] = channels[i];
            }
        });
        var playlist = [];
        var Guild = {};

        if (fs.existsSync('./playlists/' + req.guild + '/' + req.guild + '.json')) {
            var songs = lib.openJSON('./playlists/' + req.guild + '/' + req.guild + '.json');
            playlist = songs.tracks;
        }

        if (!bot.servers.has("id", req.guild)) {
            res.redirect("https://discordapp.com/oauth2/authorize?&client_id=" + Auth.clientID + "&scope=bot&permissions=3148800&guild=" + req.guild + "&response_type=code&redirect_uri=https://beta.r3alb0t.xyz/servers");

        }
        else {
            var theGuild = bot.servers.get("id", req.guild);
            if (theGuild.icon != null) {
                Guild.icon = "https://discordapp.com/api/guilds/" + req.guild + "/icons/" + theGuild.icon + ".jpg";
            }
            else {
                Guild.icon = "https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png";
            }
            Guild.name = theGuild.name;
            res.render('plugin-music.ejs', {
                user: req.user,
                playlist: playlist,
                guild: Guild.name,
                icon: Guild.icon,
                guildID: req.guild,
                bot: bot,
                addon: "music"
            });
        }
    });

    server.get('/terminal/:guild/cmd', checkAuth, function(req, res) {

        checkGuild(req.guild, req.user);
        var Guild = {};


        async.waterfall([
            (cb) => {
                db.smembers(`Commands.${req.guild}:commands`, (err, cmds) => {
                    cb(null, cmds)
                })
            },
            (titles, cb) => {
                var commands = []
                db.sort(`Commands.${req.guild}:commands`, "by", `Commands.${req.guild}:commands`, "get", `Commands.${req.guild}:command:*`, (err, messages) => {
                    messages.forEach((message, index, array, thisArg) => {
                        var cmd = {
                            title: titles[index],
                            message: message
                        }
                        commands.push(cmd)
                    })

                    cb(null, commands)
                })
            }
        ], (err, commands) => {
            var theGuild = bot.servers.get("id", req.guild);
            if (theGuild.icon != null) {
                Guild.icon = "https://discordapp.com/api/guilds/" + req.guild + "/icons/" + theGuild.icon + ".jpg";
            }
            else {
                Guild.icon = "https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png";
            }
            Guild.name = theGuild.name;
            res.render('plugin-messages.ejs', {
                user: req.user,
                playlist: -1,
                guild: Guild.name,
                icon: Guild.icon,
                guildID: req.guild,
                commands: commands,
                addon: "cmd"
            });
        })
    })


    io.on('connection', function(socket) {
        console.log('a user connected');
        var songEnd = function songEnd() {
            io.emit('songEnd');
        }

        var patt = new RegExp("https://beta.r3alb0t.xyz/terminal/[0-9]+/music");

        if (patt.test(socket.handshake.headers.referer)) {
            console.log("table loaded");
        }
        socket.on('disconnect', function() {
            console.log("disconnected");
        });
    });

    server.param('command', (req, res, next, command) => {
        req.command = command
        next();
    })


    server.get('/terminal/:guild/cmd/:command/delete', (res, req) => {
        var plugin = bot.registry.plugins.get("customCommands" + req.guild)
        if (plugin != null) {
            bot.registry.unregisterCommand(plugin, plugin.commands.get("id", req.command));
        }
        db.srem(`Commands.${req.guild}:commands`, req.command)
        db.del(`Commands.${req.guild}:command:${req.command}`)
        res.redirect("/terminal/" + req.guild + "/cmd");
    })

    server.post('/terminal/:guild/cmd/add', (req, res) => {
        var message = req.body.message;
        var name = req.body.title;
        var server = req.guild

        var guildPlugin = new customPlugin(bot.servers.get("id", server))

        var theCommand = new customCommand(name, message, guildPlugin);

        var command = {
            title: name,
            message: message
        }

        db.sadd(`Commands.${server}:commands`, name, function(error, res) {
            // console.log(res);
        })
        db.set(`Commands.${server}:command:${name}`, message, function(err, res) {
            // console.log(res);
        });

        bot.registry.registerPrefix(guildPlugin, "$$")
        bot.registry.registerCommand(theCommand)

        res.redirect('/terminal/' + server + '/cmd')
    });

    server.get('/playlist/:guild', (req, res) => {

        var Guild = {};

        if (fs.existsSync('./playlists/' + req.guild + '/' + req.guild + '.json')) {
            var songs = lib.openJSON('./playlists/' + req.guild + '/' + req.guild + '.json');
            playlist = songs.tracks;
        }

        var theGuild = bot.servers.get("id", req.guild);
        if (theGuild.icon != null) {
            Guild.icon = "https://discordapp.com/api/guilds/" + req.guild + "/icons/" + theGuild.icon + ".jpg";
        }
        else {
            Guild.icon = "https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png";
        }
        Guild.name = theGuild.name;
        res.render('playlist.ejs', {
            user: req.user,
            playlist: playlist,
            guild: Guild.name,
            icon: Guild.icon,
            guildID: req.guild,
            bot: bot,
            addon: "music"
        });
    })

    server.get('/terminal/:guild/credits', checkAuth, (req, res) => {

        var Guild = {}

        console.log(req.guild)

        if (!bot.servers.has("id", req.guild)) res.redirect('/')
        Guild = bot.servers.get("id", req.guild)
        async.series({
            credits: (cb) => {
                db.sort(`Credits.${req.guild}:members`, "by", `Credits.${req.guild}:member:*:credits`, "GET", `Credits.${req.guild}:member:*:credits`, "DESC", function(err, res) {
                    cb(null, res)
                })
            },
            names: (cb) => {
                db.sort(`Credits.${req.guild}:members`, "by", `Credits.${req.guild}:member:*:credits`, "GET", `Credits.${req.guild}:member:*:name`, "DESC", function(err, res) {
                    cb(null, res)
                })
            },
            descriminators: (cb) => {
                db.sort(`Credits.${req.guild}:members`, "by", `Credits.${req.guild}:member:*:credits`, "GET", `Credits.${req.guild}:member:*:discriminator`, "DESC", function(err, res) {
                    cb(null, res)
                })
            },
            avatars: (cb) => {
                db.sort(`Credits.${req.guild}:members`, "by", `Credits.${req.guild}:member:*:credits`, "GET", `Credits.${req.guild}:member:*:avatar`, "DESC", function(err, res) {
                    res.forEach((item, index, res, thisArgs) => {
                        res[index] = "https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png";
                    })
                    cb(null, res)
                })
            }
        }, (err, credits) => {
            res.render('credits.ejs', {
                user: req.user,
                bot: bot,
                guild: Guild.name,
                icon: Guild.iconURL,
                credits: credits
            });
        })
    })

    server.get('/credits/:guild', (req, res) => {

        var Guild = {}

        console.log(req.guild)

        if (!bot.servers.has("id", req.guild)) res.redirect('/')
        Guild = bot.servers.get("id", req.guild)
        async.series({
            credits: (cb) => {
                db.sort(`Credits.${req.guild}:members`, "by", `Credits.${req.guild}:member:*:credits`, "GET", `Credits.${req.guild}:member:*:credits`, "DESC", function(err, res) {
                    // console.log(res)
                    cb(null, res)
                })
            },
            names: (cb) => {
                db.sort(`Credits.${req.guild}:members`, "by", `Credits.${req.guild}:member:*:credits`, "GET", `Credits.${req.guild}:member:*:name`, "DESC", function(err, res) {
                    // console.log(res)
                    cb(null, res)
                })
            },
            descriminators: (cb) => {
                db.sort(`Credits.${req.guild}:members`, "by", `Credits.${req.guild}:member:*:credits`, "GET", `Credits.${req.guild}:member:*:discriminator`, "DESC", function(err, res) {
                    // console.log(res)
                    cb(null, res)
                })
            },
            avatars: (cb) => {
                db.sort(`Credits.${req.guild}:members`, "by", `Credits.${req.guild}:member:*:credits`, "GET", `Credits.${req.guild}:member:*:avatar`, "DESC", function(err, res) {
                    res.forEach((item, index, res, thisArgs) => {
                        res[index] = "https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png";
                    })
                    cb(null, res)
                })
            }
        }, (err, credits) => {
            res.render('credits.ejs', {
                user: req.user,
                bot: bot,
                guild: Guild.name,
                icon: Guild.iconURL,
                credits: credits
            });
        })
    })

    server.post('/terminal/:guild/credits/give', (req, res) => {

    })


    server.param('request', function(req, res, next, code) {
        req.code = code;
        next();
    })

    server.get('/.well-known/acme-challenge/:request', function(req, res) {
        res.send(req.code);
    });

    server.use(catch404);
    server.use(errorHandler);
}

class webServer extends Plugin {
    constructor(bot, registry) {
        super("webServer");
        this.id = "websever"
        this.name = "webServer"
        this.author = "R3alCl0ud"
        this.version = "1.0.0"
        this.registry = registry
        this.bot = bot
    }

    loadPlugin() {
        if (!this.loaded) {
            start(this.bot, this.registry)
            this.loaded = true;
        }
    }
}


module.exports = function(bot, registry) {
    return null;
    //return new webServer(bot, registry);
};
