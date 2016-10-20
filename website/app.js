var express = require('express'),
    path = require('path'),
    server = express(),
    session = require('express-session'),
    port = 3300,
    passport = require('passport'),
    Strategy = require('passport-discord').Strategy,
    bodyParser = require('body-parser');


const reactViews = require('express-react-views');
const Auth = require('../options.json').Auth
const routes = require('./routes/router');
const api = require('./routes/api');
const authChecks = require('./lib/authChecks');


// server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'js');
server.engine('js', reactViews.createEngine())


// Include static assets. Not advised for production
server.use(express.static(path.join(__dirname, 'public')));
// Set view path
// set up ejs for templating. You can use whatever

server.use('/', routes.index);
server.use('/api', api)
server.use('/auth', routes.auth);


function errorHandler(err, req, res, next) {
    res.status(err.status || 500);
    const page = {
        page: "Error",
        name: `Error - ${err.status} `,
        desc: `Error - ${err.status}: ${err.message}`
    };
    let guilds = [];
    if (req.user) guilds = authChecks.adminInGuilds(req.user);
    res.render('errPage', {title: `Error - ${err.status}`, message: err.message, error: err, user: req.user, page: page});
}

function catch404(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

server.use(catch404);
server.use(errorHandler);



// Set up Routes for the serverlication

//Route not found -- Set 404
// server.get('*', function(req, res) {
    // res.json({
        // 'route': 'Sorry this page does not exist!'
    // });
// });

server.listen(port);
console.log('Server is Up and Running at Port : ' + port);

//bot.login(Auth.token);