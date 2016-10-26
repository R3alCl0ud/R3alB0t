const lib = require('../../../../lib');

module.exports = class upTime extends lib.Command {
    constructor(plugin) {
        super("upTime", null, plugin);
        this.setAlias(["uptime"]);
        this.role = "@everyone";
        this.description = "Shows the bots uptime";
        this.Message = function(message, author, channel) {
            let sec_num = parseInt(process.uptime(), 10);
            let days = Math.floor(sec_num / 86400);
            sec_num %= 86400;
            let hours = Math.floor(sec_num / 3600);
            let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            let seconds = sec_num - (hours * 3600) - (minutes * 60);
            if (days < 10) days = "0" + days;
            if (hours < 10) hours = "0" + hours;
            if (minutes < 10) minutes = "0" + minutes;
            if (seconds < 10) seconds = "0" + seconds;
            let time = `${days}:${hours}:${minutes}:${seconds}`;
            channel.sendMessage("Online for " + time).then(message => {
               message.delete(7000)
            }).catch(console.log);
        }

    }
}
