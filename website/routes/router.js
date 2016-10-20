var express = require("express"),
    api = express.Router(),
    session = require('express-session'),
    passport = require('passport'),
    Strategy = require('passport-discord').Strategy,
    bodyParser = require('body-parser');

const React = require('react');
const fs = require('fs');
const router = express.Router()
const authChecks = require('../lib/authChecks');
const Auth = require('../options.json').Auth
const Navigator = require('../lib/navHelper');
const redis = require('redis');
const db = redis.createClient({db: 1});
const async = require('async');
const request = require('request');
const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');
const base64url = require('base64url');
// require('node-jsx').install();

const DISCORD_AUTHORIZATION_HEADER = {Authorization: `Bot ${Auth.token}`};
const DISCORD_API_BASE_URL = "https://discordapp.com/api/";
const DISCORD_API_GUILD_URL = `${DISCORD_API_BASE_URL}guilds/`;
const DISCORD_API_CHANNEL_URL = `${DISCORD_API_BASE_URL}channels/`;
const DISCORD_API_USER_URL = `${DISCORD_API_BASE_URL}users/`;
const DISCORD_API_GET_GUILD = GUILD_ID => {return {url: `${DISCORD_API_GUILD_URL}${GUILD_ID}`, headers: DISCORD_AUTHORIZATION_HEADER}};
const DISCORD_API_GET_GUILD_ROLES = GUILD_ID => {return {url: `${DISCORD_API_GUILD_URL}${GUILD_ID}/roles`, headers: DISCORD_AUTHORIZATION_HEADER}};
const DISCORD_API_GET_GUILD_CHANNELS = GUILD_ID => {return {url: `${DISCORD_API_GUILD_URL}${GUILD_ID}/channels`, headers: DISCORD_AUTHORIZATION_HEADER}};
const DISCORD_API_GET_GUILD_MEMBERS = GUILD_ID => {return {url: `${DISCORD_API_GUILD_URL}${GUILD_ID}/members`, headers: DISCORD_AUTHORIZATION_HEADER}};
const DISCORD_API_GET_GUILD_MEMBER = (GUILD_ID, MEMBER_ID) => {return {url: `${DISCORD_API_GUILD_URL}${GUILD_ID}/members/${MEMBER_ID}`, headers: DISCORD_AUTHORIZATION_HEADER}};
const DISCORD_API_GET_USER = USER_ID => {return {url: `${DISCORD_API_USER_URL}${USER_ID}`, headers: DISCORD_AUTHORIZATION_HEADER}};
const DISCORD_API_GET_MESSAGE = (CHANNEL_ID, MESSAGE_ID) => {return {url: `${DISCORD_API_CHANNEL_URL}${CHANNEL_ID}/messages/${MESSAGE_ID}`, headers: DISCORD_AUTHORIZATION_HEADER}};
const DISCORD_DEFAULT_AVATAR = 'https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png';
const DISCORD_API_GET_USER_AVATAR = (USER_ID, AVATAR_HASH) => {return AVATAR_HASH ? `${DISCORD_API_USER_URL}${USER_ID}/avatars/${AVATAR_HASH}.jpg` : DISCORD_DEFAULT_AVATAR};
const DISCORD_API_GET_GUILD_ROLES_USER_TOKEN = (ACCESS_TOKEN, GUILD_ID) => {return {url: `${DISCORD_API_GUILD_URL}${GUILD_ID}/roles`, headers: {Authorization: `Bearer ${ACCESS_TOKEN}`}}};
const PL_ROOT_LOC = '/usr/share/nginx/html/R3al-Plugins/playlists';


const R3ALB0T_API_BASE_URL = "https://beta.r3alb0t.xyz/api";
const R3ALB0T_API_GET_ACCESS_TOKEN = (USER_ID, TOKEN) => {return{url: `${R3ALB0T_API_BASE_URL}/users/${USER_ID}/token/access`, headers: {Authorization: TOKEN}}}

const PluginTabs = new Map();
PluginTabs.set("music", "music_0");
PluginTabs.set("currency", "currency_1");
PluginTabs.set("custom", "commands_2");

function sortObjects(a, b, key) {
    if (a[key] < b[key]) {
        return 1;
    }
    if (a[key] > b[key]) {
        return -1;
    }
    // a must be equal to b
    return 0;
}

function sortRoles(a, b) {
    return sortObjects(a, b, "position");
}

class guildStruct extends EventEmitter{
    constructor(guild, channels) {
        super();
        this.id = guild.id;
        this.array = channels;
        this.textChannels = [];
        this.voiceChannels = [];
        this.index = 0;
        this.roles = new Map();
        
        guild.roles.forEach(role => {
            this.roles.set(role.id, role);
        })
    }
    fetch() {
        if (this.index == this.array.length) return this.emit('end');
        let channel = this.array[this.index];
        if (channel.type === "text") {
            request.get(DISCORD_API_GET_MESSAGE(channel.id, channel.last_message_id), (error, response, message) => {
                if (error !== null || response.statusCode !== 200) {
                    this.textChannels.push(channel)
                    this.toNext();
                }
                if (!error && response.statusCode === 200){
                    message = JSON.parse(message);
                    message.author.avatarURL = DISCORD_API_GET_USER_AVATAR(message.author.id, message.author.avatar);
                    channel.lastMessage = message
                    this.textChannels.push(channel)
                    this.toNext();
                }
            })
        }
        if (channel.type === "voice") {
            this.voiceChannels.push(channel)
            this.toNext();
        }
    }
    
    getRewards(roleID) {
        return new Promise((resolve, reject) => {
            db.multi()
            .get(`Guilds.${this.id}:roles.${roleID}:price`)
            .get(`Guilds.${this.id}:roles.${roleID}:pre`)
            .exec((err, results) => {
                if (err) return reject(err);
                const role = this.roles.get(roleID);
                role.price = results[0] || 0;
                role.pre = results[1] === 0 ? "None" : results[1] || "None";
                if (this.roles.has(role.pre)) role.preName = this.roles.get(role.pre).name;
                resolve(role);
            })
        })
    }
    
    toNext() {
        this.index++;
        this.fetch();
    }
    
    loadMessages() {
        return new Promise((resolve, reject) => {
            this.fetch();
            
            this.on('end', () =>{
                if (1 == 1) resolve({textChannels: this.textChannels, voiceChannels: this.voiceChannels})
                else if (1 == 2) reject("Failed for no reason");
            })
        })
    }
}

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true}));



var passInit = passport.initialize()
var passSess = passport.session()

api.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

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
    callbackURL: 'https://beta.r3alb0t.xyz/auth/callback',
    scope: scopes
}, function(accessToken, refreshToken, userProfile, cb) {
    process.nextTick(function() {
        console.log(`${accessToken} || ${refreshToken}`);
        db.set(`Users.${userProfile.id}:username`, userProfile.username)
        db.set(`Users.${userProfile.id}:discriminator`, userProfile.discriminator)
        db.set(`Users.${userProfile.id}:id`, userProfile.id);
        db.set(`Users.${userProfile.id}:accessToken`, accessToken);
        db.get(`Users.${userProfile.id}:token`, (err, token) => {
            if (err) console.log(err);
            if (token) return;
            const hexToken = crypto.randomBytes(24).toString('hex');
            const base64Token = base64url(hexToken);
            db.set(`Users.${userProfile.id}:token`, base64Token);
        })
        return cb(null, userProfile);
    });
}));

api.use(passInit);
router.use(passInit);
api.use(passSess);
router.use(passSess);



api.get('/login', passport.authenticate('discord', {
    scope: scopes
}), (req, res) => {});
api.get('/callback',
    passport.authenticate('discord', {
        failureRedirect: '/'
    }),
    function(req, res) {
        console.log(req.query);
        res.redirect('/auth/confirmLoggin')
    } // auth success
);
api.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
api.get('/confirmLoggin', authChecks.checkAuth, function(req, res) {
    res.statusCode = 302;
    res.setHeader('Location', 'https://beta.r3alb0t.xyz/dashboard/me');
    // res.redirect('/');
    res.end();

});

api.get('/home', (req, res) => {
    res.statusCode = 302;
    res.setHeader('Location', 'https://beta.r3alb0t.xyz/');
    res.end();
});

router.get('/user/profile', authChecks.checkAuth, (req, res) => {
    res.render('profile', {
        title: `Profile - ${req.user.username}`,
        user: req.user
    })
});

router.get('/', function(req, res) {
    let page = {
        page:"Home",
        name:"",
        desc:""
    }
    const user = req.user
    if (user) {
        const guilds = authChecks.adminInGuilds(user);
        const props = {title: "R3alB0at", user: user, guilds: guilds, page: page} 
        res.render('index', props);
    } else {
        const props = {title: "R3alB0at", user: user, page: page} 
        res.render('index', props);
    }
})

router.get('/dashboard/me', authChecks.checkAuth, (req, res) => {
    let page = {
        page:"Dashboard",
        name:"Dashboard ",
        desc:"your dashboard"
    }
    
    if (req.query.resetToken) {
        const hexToken = crypto.randomBytes(24).toString('hex');
        const base64Token = base64url(hexToken);
        console.log(base64Token);
        db.set(`Users.${req.user.id}:token`, base64Token);
    }
    
    async.series({
        credits: (cb) => {
            db.get(`Credits.${req.user.id}:credits`, (err, res) => {
                if (err) {
                    cb(err)
                    return;
                }
                cb(null, res)
                return;
            });
        },
        token :(cb) => {
            db.get(`Users.${req.user.id}:token`, (err, token) => {
                if (err) {
                    cb(err);
                    return;
                }
                cb(null, token);
                return;
            })
        }
    }, (err, result) => {
        if (err) console.log(err);
        const guilds = authChecks.adminInGuilds(req.user);
        res.render('dashboard', {
            title: `Dashboard - ${req.user.username}`,
            user: req.user,
            guilds: guilds,
            credits: result.credits,
            token: result.token,
            page: page
        });
    })
})




router.get('/profile', authChecks.checkAuth, (req, res) => {
    let page = {
        page:"Profile",
        name:"Profile ",
        desc:"your profile"
    }
    var guilds = authChecks.adminInGuilds(req.user);
    res.render('profile', {
        title: `Profile - ${req.user.username}`,
        user: req.user,
        guilds: guilds,
        page: page
    })
})

router.get('/dashboard/guild/:guildID', authChecks.checkAuth, (req, res, next) => {

    request.get(DISCORD_API_GET_GUILD(req.guildID), (err, response, guild) => {
        if (err) return next(err);

        if (response.statusCode !== 200){
            res.redirect(`https://discordapp.com/oauth2/authorize?&client_id=${Auth.clientID}&scope=bot&permissions=2146958399&guild_id=${req.guildID}&response_type=code&redirect_uri=https://${encodeURIComponent(req.hostname)}/dashboard/me`);
            return;
        }
        guild = JSON.parse(guild);
        
        guild.roles = guild.roles.sort(sortRoles);
        let page = {
            page: "Server",
            name: guild.name + " ",
            desc:`${guild.name} - dashboard`
        }
        
        request.get(DISCORD_API_GET_GUILD_CHANNELS(req.guildID), (error, response, channels) => {
            if (err) return next(err);

            if (response.statusCode !== 200) return res.redirect('/dashboard/me');
                
            let textChannels = [];
            let voiceChannels = [];
            
            let counter = 0;
            const GUILD = new guildStruct(guild, JSON.parse(channels));
            let playlist = {tracks: []};
            if (fs.existsSync(`${PL_ROOT_LOC}/${req.guildID}/${req.guildID}.json`)) {
                playlist = JSON.parse(fs.readFileSync(`${PL_ROOT_LOC}/${req.guildID}/${req.guildID}.json`));
            }
            
            
            GUILD.loadMessages().then(({textChannels, voiceChannels}) => {
                guild.textChannels = textChannels
                guild.voiceChannels = voiceChannels;
                const guilds = authChecks.adminInGuilds(req.user);
                db.multi()
                .get(`Users.${req.user.id}:token`)
                .sort(`Credits.${req.guildID}:members`, "by", `Credits.${req.guildID}:member:*:credits`, "DESC")
                .sort(`Credits.${req.guildID}:members`, "by", `Credits.${req.guildID}:member:*:credits`, "GET", `Credits.${req.guildID}:member:*:credits`, "DESC")
                .sort(`Credits.${req.guildID}:members`, "by", `Credits.${req.guildID}:member:*:credits`, "GET", `Credits.${req.guildID}:member:*:name`, "DESC")
                .sort(`Credits.${req.guildID}:members`, "by", `Credits.${req.guildID}:member:*:credits`, "GET", `Credits.${req.guildID}:member:*:discriminator`, "DESC")
                .sort(`Credits.${req.guildID}:members`, "by", `Credits.${req.guildID}:member:*:credits`, "GET", `Credits.${req.guildID}:member:*:avatar`, "DESC")
                .smembers(`Commands.${req.guildID}:commands`)
                .sort(`Commands.${req.guildID}:commands`, "by", `Commands.${req.guildID}:commands`, "get", `Commands.${req.guildID}:command:*`)
                .smembers(`Guilds.${req.guildID}:enabledPlugins`)
                .exec((err, results) => {
                    if (err) return next(err);
                    const credits = {ids: results[1], credits: results[2], names: results[3], descriminators: results[4], avatars: results[5]};
                    const commands = [];
                    
                    results[7].forEach((command, index) => {
                       const cmd = {
                           title: results[6][index],
                           message: command
                       };
                       commands.push(cmd);
                    });
                    const rolePromises = [];
                    
                    guild.roles.forEach(role => {
                        rolePromises.push(GUILD.getRewards(role.id));
                    })
                    Promise.all(rolePromises).then(roles => {
                        guild.roles = roles;
                        res.render('server', {title: `Dashboard - ${guild.name}`, user: req.user, guild: guild, playlist: playlist, credits: credits, commands: commands, guilds: guilds, token: results[0], plugins: results[8], page: page});
                    }).catch(next);
                });
            }).catch(next);
        })
    })
})

router.post('/dashboard/guild/:guildID/command/add', authChecks.checkAuth, (req, res) => {
    if (req.query.edit) db.publish(`Guilds.${req.guildID}:deletecommand`, JSON.stringify({command: req.body.title}));
    console.log(req.query, req.body)
    db.sadd(`Commands.${req.guildID}:commands`, req.body.title);
    db.set(`Commands.${req.guildID}:command:${req.body.title}`, req.body.message);
    db.publish(`Guilds.${req.guildID}:addcommand`, JSON.stringify({command: req.body.title, message: req.body.message}));
    res.redirect(`/dashboard/guild/${req.guildID}#tab_commands_2`);
});

router.get('/dashboard/guild/:guildID/command/:commandID/delete', authChecks.checkAuth, (req, res) => {
    db.srem(`Commands.${req.guildID}:commands`, req.commandID);
    db.del(`Commands.${req.guildID}:command:${req.commandID}`);
    db.publish(`Guilds.${req.guildID}:deletecommand`, JSON.stringify({command: req.commandID}));
    res.redirect(`/dashboard/guild/${req.guildID}#tab_commands_2`);
});

router.get('/dashboard/guild/:guildID/plugin/:plugin/enable', authChecks.checkAuth, (req, res, next) => {
    db.publish(`Guilds.${req.guildID}:enable`, JSON.stringify({plugin: req.plugin}));
    res.redirect(`/dashboard/guild/${req.guildID}#tab_${PluginTabs.get(req.plugin)}`);
});

router.get('/dashboard/guild/:guildID/plugin/:plugin/disable', authChecks.checkAuth, (req, res, next) => {
    db.publish(`Guilds.${req.guildID}:disable`, JSON.stringify({plugin: req.plugin}));
    res.redirect(`/dashboard/guild/${req.guildID}#tab_${PluginTabs.get(req.plugin)}`);
});

router.get('/guild/:guildID/playlist', (req, res, next) => {
    
    request.get(DISCORD_API_GET_GUILD(req.guildID), (err, response, guild) => {
        if (err) return next(err);

        if (response.statusCode !== 200) return res.redirect(`https://${encodeURIComponent(req.hostname)}`);
        
        guild = JSON.parse(guild);        
        
        let page = {
            page: "Server",
            name: guild.name + " ",
            desc:`${guild.name} - Playlist`
        }
        let playlist = {};
        if (fs.existsSync(`${PL_ROOT_LOC}/${req.guildID}/${req.guildID}.json`)) {
            playlist = JSON.parse(fs.readFileSync(`${PL_ROOT_LOC}/${req.guildID}/${req.guildID}.json`));
        }
        let guilds = [];
        if (req.user) guilds = authChecks.adminInGuilds(req.user);
        res.render('music', {title: `Playlist - ${guild.name}`, user: req.user, guild: guild, guilds: guilds, playlist: playlist, page: page});
    });
});

router.post('/guild/:guildID/store/update', authChecks.checkAuth, (req, res) => {
    // console.log(req.body);
    for (const key in req.body) {
        if (!isNaN(parseInt(req.body[key], 10)) && parseInt(req.body[key], 10) >= 0) db.set(`Guilds.${req.guildID}:roles.${key.split('_')[1]}:${key.split('_')[0]}`, req.body[key]);
    }
    res.redirect(`/dashboard/guild/${req.guildID}#tab_${PluginTabs.get("currency")}`);
})

router.get('/guild/:guildID/store', (req, res, next) => {
    request.get(DISCORD_API_GET_GUILD(req.guildID), (err, response, guild) => {
        if (err) return next(err);
        if (response.statusCode !== 200) return res.redirect(`https://${encodeURIComponent(req.hostname)}`);
        guild = JSON.parse(guild);
        const GUILD = new guildStruct(guild);
        const page = {
            page: "Server",
            name: guild.name + " ",
            desc:`${guild.name} - Store`
        };
        let guilds = [];
        if (req.user) guilds = authChecks.adminInGuilds(req.user);
        const rewards = [];
        guild.roles.forEach(role => {
            rewards.push(GUILD.getRewards(role.id));
        });
        Promise.all(rewards).then(roles => {
            guild.roles = roles;
            res.render('store', {title: `Store - ${guild.name}`, user: req.user, guild: guild, guilds: guilds, page: page});
        }).catch(next);
    });
})

router.get('/guild/:guildID/store/purchase/:roleID', authChecks.checkAuth, (req, res, next) => {
    
});

/*router.get('/store', (req, res, next) => {
    
});*/ 

router.get('/guild/:guildID', (req, res) => {
    res.redirect('/');
})

router.get('/guild', (req, res) => {
    res.redirect('/');
})

router.param('guildID', (req, res, next, guildID) => {
    req.guildID = guildID;
    next();
});

router.param('commandID', (req, res, next, commandID) => {
    req.commandID = commandID;
    next();
})

router.param('roleID', (req, res, next, roleID) => {
    req.roleID = roleID;
    next();
})
router.param('plugin', (req, res, next, plugin) => {
    req.plugin = plugin;
    next();
})

function errorHandler(err, req, res, next) {
    console.log(err)
            let page = {
            page: "error",
            name: "Error ",
            desc:"Error"
        }
    
    res.status(err.status || 500);
    res.render('errPage', {
        title: `Error - ${err.status}`,
        message: err.message,
        error: err,
        user: req.user,
        page: page
    });
}

function catch404(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

exports.index = router;
exports.auth = api;
