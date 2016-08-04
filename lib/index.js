var util = require('./util/util');
var botHandler = require('./core/Bothandler');

module.exports = {

    // Regular Expressions
    YTRegex: /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-]+)(&(amp;)?[\w\?=]*)?/,
    SCRegex: /(?:https?:\/\/)?(?:www\.)?(?:soundcloud\.com|snd\.sc)\/(.*)/,
    YTPlaylistRegex: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([A-Za-z0-9_-]+)/,
    SCPlaylistRegex: /(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/([a-zA-Z0-9]+)\/sets\/(.*)/,

    openJSON: util.openJSON,
    writeJSON: util.writeJSON,


    isRole: util.isRole,
    serverIndex: util.serverIndex,
    isRoleServer: util.isRoleServer,
    hasPerms: util.hasPerms,

    Bot: botHandler

}
