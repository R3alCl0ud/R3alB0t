var express = require("express"),
    api = express.Router(),
    bodyParser = require('body-parser');


const Options = require('../options.json');
const Auth = Options.Auth;
const Navigator = require('../lib/navHelper');
const redis = require('redis');
const db = redis.createClient({db: 1});
const async = require('async');
const request = require('request');
const EventEmitter = require('events').EventEmitter;
const Codes = require('./codes.json').codes;

const DISCORD_AUTHORIZATION_HEADER = {Authorization: `Bot ${Auth.token}`};
const DISCORD_USER_HEADER = ACCESS_TOKEN => {return{Authorization: `Bearer ${ACCESS_TOKEN}`}};
const DISCORD_DEFAULT_AVATAR = 'https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png';
const DISCORD_API_BASE_URL = "https://discordapp.com/api/";
const DISCORD_API_GUILD_URL = `${DISCORD_API_BASE_URL}guilds/`;
const DISCORD_API_CHANNEL_URL = `${DISCORD_API_BASE_URL}channels/`;
const DISCORD_API_USER_URL = `${DISCORD_API_BASE_URL}users/`;
const DISCORD_API_GET_GUILD = GUILD_ID => {return {url: `${DISCORD_API_GUILD_URL}${GUILD_ID}`, headers: DISCORD_AUTHORIZATION_HEADER}};
const DISCORD_API_GET_GUILD_CHANNELS = GUILD_ID => {return {url: `${DISCORD_API_GUILD_URL}${GUILD_ID}/channels`, headers: DISCORD_AUTHORIZATION_HEADER}};
const DISCORD_API_GET_GUILD_MEMBERS = GUILD_ID => {return {url: `${DISCORD_API_GUILD_URL}${GUILD_ID}/members`, headers: DISCORD_AUTHORIZATION_HEADER}};
const DISCORD_API_GET_GUILD_MEMBER = (GUILD_ID, MEMBER_ID) => {return {url: `${DISCORD_API_GUILD_URL}${GUILD_ID}/members/${MEMBER_ID}`, headers: DISCORD_AUTHORIZATION_HEADER}};
const DISCORD_API_GET_USER = USER_ID => {return {url: `${DISCORD_API_USER_URL}${USER_ID}`, headers: DISCORD_AUTHORIZATION_HEADER}};
const DISCORD_API_GET_MESSAGE = (CHANNEL_ID, MESSAGE_ID) => {return {url: `${DISCORD_API_CHANNEL_URL}${CHANNEL_ID}/messages/${MESSAGE_ID}`, headers: DISCORD_AUTHORIZATION_HEADER}};
const DISCORD_API_GET_USER_AVATAR = (USER_ID, AVATAR_HASH) => {return AVATAR_HASH ? `${DISCORD_API_USER_URL}${USER_ID}/avatars/${AVATAR_HASH}.jpg` : DISCORD_DEFAULT_AVATAR};
const DISCORD_API_GET_USER_GUILDS = (USER_ID, ACCESS_TOKEN) => {return {url: `${DISCORD_API_USER_URL}@me/guilds`, headers: {Authorization: `Bearer ${ACCESS_TOKEN}`}}};

const errorCodes = new Map();

Codes.forEach(codeRes => {
    errorCodes.set(codeRes.code, codeRes)
})


function hasGuild(userId, guildId, accessToken) {
    return new Promise((resolve, reject) => {
        request.get(DISCORD_API_GET_USER_GUILDS(userId, accessToken), (err, response, body) => {
            if (err || response.statusCode !== 200) {
                reject(err || body || response.statusCode);
                return;
            }
            const guilds = JSON.parse(body);
            guilds.forEach(guild => {
                if (guild.id === guildId) {
                    resolve(guild.permissions, guild.owner);
                    return;
                }
            })
            reject(10004);
        })
    })
}

function userInGuild(userId, guildId) {
    return new Promise((resolve, reject) => {
        request.get(DISCORD_API_GET_GUILD_MEMBER(guildId, userId), (err, response, body) => {
            if (err || response.statusCode !== 200) {
                reject(err || body || response.statusCode);
                return;
            }
            resolve();
        })
    })
}

function checkAuthToken(clientId, token) {
    return new Promise((resolve, reject) => {
        db.get(`Users.${clientId}:token`, (err, apiToken) => {
            console.log("test", err, apiToken);
            if (err || apiToken === null){
                return reject(err || 50014);
            }
            if (apiToken !== token) {
                return reject(50014);
            }
            resolve();
        })
    })
}

function getDiscordToken(userId) {
    return new Promise((resolve, reject) => {
        db.get(`Users.${userId}:accessToken`, (err, token) => {
            if (err || token === null){
                console.log(err)
                reject(err || 10001);
                return;
            }
            resolve(token);
        })
    })
}

function userCredits(user_id, guild_id) {
    return new Promise((resolve, reject) => {

        db.get(`Credits.${guild_id}:member:${user_id}:credits`, (err, credits) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(credits);
        });
    })
}

function userName(user_id, guild_id) {
    return new Promise((resolve, reject) => {
        db.get(`Credits.${guild_id}:member:${user_id}:name`, (err, name) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(name);
        });
    })
}

function userDescriminator(user_id, guild_id) {
    return new Promise((resolve, reject) => {
        db.get(`Credits.${guild_id}:member:${user_id}:discriminator`, (err, discrim) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(discrim);
        });
    })
}

function userAvatar(user_id, guild_id) {
    return new Promise((resolve, reject) => {
        db.get(`Credits.${guild_id}:member:${user_id}:avatar`, (err, avatar) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(avatar);
        });
    })
}


function failedPromise(response, webRes) {
    console.log(response)
    if (!errorCodes.has(response)) {
        console.log("didn't find error code")
        webRes.json(response);
        return;
    }
    webRes.statusCode = errorCodes.get(response).code
    webRes.json(errorCodes.get(response));
}

function badRequest(err, req, res, next) {
    console.log(err)
    if (!errorCodes.has(err.toString)) {
        return res.json(err);
    }
    res.statusCode = errorCodes.get(err).code
    res.json(errorCodes.get(err));
}

api.get('/test', (req, res, next) => {
    // console.log(req)
    res.send(req.get("Authorization"));
})

api.get('/credits/:guild/members/:user', (req, res, next) => {

    const token = req.get("Authorization");
    const clientId = req.query.client_id
    const { guildID, userID } = req;
    if (!clientId) {
        return res.json(errorCodes.get(50001));
    }
    checkAuthToken(clientId, token).then(() => {
        getDiscordToken(clientId).then(token => {
            hasGuild(clientId, guildID, token).then((permissions, owner) => {
                if ((((permissions >> 5) & 1) == 0) && !owner) {
                    res.statusCode = 401
                    return res.json(errorCodes.get(401))
                }
                userInGuild(userID, guildID).then(() => {
                    const promises = [];
                    promises.push(userName(userID, guildID));
                    promises.push(userDescriminator(userID, guildID));
                    promises.push(userCredits(userID, guildID));
                
                    Promise.all(promises).then(user => {
                        let noUser = true;
                        user.forEach(prop => {
                            if (prop) {
                                noUser = false;
                            }
                        }) ;
                        if (!noUser) return res.json({id: req.userID, username: user[0], discriminator: user[1], credits: user[2]});
                        return next(404);
                    }).catch(next); 
                }).catch(next);
            }).catch(next);
        }).catch(next);
    }).catch(next);
})

api.get('/credits/:guild/members', (req, res, next) => {
    const token = req.get("Authorization");
    const clientId = req.query.client_id;
    if (!clientId) return res.json(errorCodes.get(50001));
    
    checkAuthToken(clientId, token).then(() => {
        getDiscordToken(clientId).then(token => {
            
        }).catch(next);
    }).catch(next);
});

api.get('/message/:channel/:message', (req, res, next) => {

});

api.get('/users/:user/token/access', (req, res, next) => {
    const token = req.get("Authorization");
    console.log(token)
    checkAuthToken(req.userID, token).then(() => {
        getDiscordToken(req.userID).then(accessToken => {
            res.json({id: req.userID, token: accessToken});
        }).catch(err => {
            console.log(`Can't get code: ${err}`);
            return next(err);
        });
    }).catch(err => {
            console.log(`code not valid ${err}`);
            return next(err);
        });
});


api.param('guild', (req, res, next, guild) => {
    req.guildID = guild
    next()
})

api.param('channel', (req, res, next, channel) => {
    req.channelID = channel
    next()
})

api.param('message', (req, res, next, message) => {
    req.messageID = message
    next()
})

api.param('user', (req, res, next, user) => {
    req.userID = user
    next()
})

// api.use(badRequest);

module.exports = api;