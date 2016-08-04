var fs = require('fs');
var path = require('path');
var serverList = './servers.json';
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'discordBot'
});


var skipping = [];
skipping[0] = false;

exports.openJSON = function(JSONFile) {
    var jason = JSON.parse(fs.readFileSync(JSONFile.toString()));
    return jason;
}

exports.writeJSON = function(JSONFile, jsonOb) {
    fs.writeFileSync(JSONFile, JSON.stringify(jsonOb, null, "\t"));
}

exports.timeToMs = function(time) {
    var final = 0;
    var hms = time.split(":");
    for (var i = 0; i < hms.length; i++) {
        var newfinal = final + parseInt(hms[i]) * Math.pow(60, hms.length - (i + 1));
        final = newfinal;
    }
    var ms = final * 1000;
    return ms;
}
exports.serverIndex = function(id) {
    var serverJSON = exports.openJSON(serverList);
    for (var i = 0; i < serverJSON.servers.length; i++) {
        if (serverJSON.servers[i].server == id) {
            return i;
        }
    }
    return -1;
}

exports.isRole = function(msg, usr, role) {
    var roles = msg.channel.server.rolesOfUser(user);
    for (var i = 0; i < roles.length; i++) {
        if (roles[i].name.toLowerCase() == role.toLowerCase())
            return 1;
    }
    return 0;
}

exports.isRoleServer = function(user, server, role) {

    if (role == "@everyone") return true;

    var roles = server.rolesOfUser(user);


    for (var i = 0; i < roles.length; i++) {
        if (roles[i].name.toLowerCase() == role.toLowerCase())
            return 1;
    }
    return 0;
}


exports.hasPerms = function(user, server, permission) {
    var roles = server.rolesOf(user);

    for (var role in roles) {
        if (roles[role].hasPermission(permission)) return true;
    }
    return false;
}
