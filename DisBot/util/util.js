var fs = require('fs');
var path = require('path');

exports.openJSON = function (JSONFile)
{
    var jason = JSON.parse(fs.readFileSync(JSONFile.toString()));
    return jason;
}

exports.writeJSON = function (JSONFile, jsonOb) {
    fs.writeFileSync(JSONFile, JSON.stringify(jsonOb, null, "\t"));
}

exports.timeToMs = function (time) {
    var final = 0;
    var hms = time.split(":");
    for (var i = 0;i < hms.length; i++) {
        var newfinal = final + parseInt(hms[i]) * Math.pow(60, hms.length - (i + 1));
        final = newfinal;
    }
    var ms = final * 1000;
    return ms;
}