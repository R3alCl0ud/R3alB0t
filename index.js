const lib = require('./lib');
const db_options = lib.openJSON('./options.json').DataBase;
const db = require('redis').createClient(db_options);

db.on('error', console.log);

module.exports = {

    // Regular Expressions
    YTRegex: /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-]+)(&(amp;)?[\w\?=]*)?/,
    SCRegex: /(?:https?:\/\/)?(?:www\.)?(?:soundcloud\.com|snd\.sc)\/(.*)/,
    YTPlaylistRegex: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([A-Za-z0-9_-]+)/,
    SCPlaylistRegex: /(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/([a-zA-Z0-9]+)\/sets\/(.*)/,

    openJSON: lib.openJSON,
    writeJSON: lib.writeJSON,

    hmsToms: lib.timeToMs,
    
    timeToMs: lib.timeToMs,
    isRole: lib.isRole,
    serverIndex: lib.serverIndex,
    isRoleServer: lib.isRoleServer,
    hasPerms: lib.hasPerms,
    
    CommandClient: lib.CommandClient,
    
    Cache: lib.Cache,
    
    Plugin: lib.Plugin,
    Command: lib.Command,
    
    getSubcommands: lib.getSubcommands,
    
    db: db
    

}