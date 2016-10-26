var express = require("express"),
    router = express.Router(),
    session = require('express-session'),
    passport = require('passport'),
    Strategy = require('passport-discord').Strategy,
    bodyParser = require('body-parser');

var Auth = require('../options.json').Auth
var authChecks = require('../lib/authChecks');

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
    callbackURL: 'https://beta.r3alb0t.xyz/user/callback',
    scope: scopes
}, function(accessToken, refreshToken, profile, cb) {
    process.nextTick(function() {
        return cb(null, profile);
    });
}));



router.get('/', passport.authenticate('discord', {
    scope: scopes
}), function(req, res) {});
router.get('/callback',
    passport.authenticate('discord', {
        failureRedirect: '/'
    }),
    function(req, res) {
        res.redirect('/user/info')
    } // auth success
);
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
router.get('/info', authChecks.checkAuth, function(req, res) {
    res.statusCode = 302;
    console.log(req.user.avatar)
    // res.setHeader('Location', 'https://beta.r3alb0t.xyz/');
    res.redirect('/');
    // res.end();

});

router.get('/home', (req, res) => {
    res.statusCode = 302;
    res.setHeader('Location', 'https://beta.r3alb0t.xyz/');
    res.end();
});


module.exports = router;
