const Auth = require('../../options.json').Auth

var BASE_GUILD_LINK = new RegExp("/dashboard/guild/[0-9]");


function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();

    res.redirect('/auth/login');
}

function checkServer(req, res, bot) {

    if (bot.guilds.has(req.guildID)) return;

    res.redirect(`https://discordapp.com/oauth2/authorize?&client_id=${Auth.clientID}&scope=bot&permissions=3148800&guild=${req.guildID}&response_type=code&redirect_uri=https://beta.r3alb0t.xyz${BASE_GUILD_LINK.test(req.originalUrl) ? '/dashboard/guild' : req.originalUrl}`);
}

function checkGuild(guildId, user, res) {

    for (var i = 0; i < user.guilds.length; i++) {
        if (user.guilds[i].id == guildId && (((user.guilds[i].permissions >> 5) & 1) == 1)) {
            return;
        } else if (user.guilds[i].id == guildId && (((user.guilds[i].permissions >> 5) & 1) == 0)) {
            break;
        }
    }
    res.redirect('/servers');
}

function adminInGuilds(user) {
    const guilds = [];
    for (var i = 0; i < user.guilds.length; i++) {
        if (user.guilds[i].owner == true || (((user.guilds[i].permissions >> 5) & 1) == 1)) {
            guilds.push(user.guilds[i]);
        }
    }
    return guilds;
}



module.exports = {
    checkAuth: checkAuth,
    checkGuild: checkGuild,
    checkServer: checkServer,
    adminInGuilds: adminInGuilds
}
