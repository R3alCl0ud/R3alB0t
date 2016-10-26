const JSONDir = './credits';
const EventEmitter = require('events').EventEmitter;
const fs = require('fs');
const lib = require('DiscordForge');
const botEvent = {};
const guilds = {};

const async = require("async");
const redis = require('redis')
const db = redis.createClient({ db: 1 });
const collectors = new Map();


function handleMessage(message, author, channel, server) {
  if (channel.type === "dm" || channel.type === 'group') return;
  if (author.bot) return;
  if (server.enabledPlugins.indexOf("currency") == -1) return;
  db.multi()
    .get(`Credits.${server.id}:autoGive`)
    .get(`Credits.${server.id}:member:${author.id}:check`)
    .exec((err, results) => {
      if (results[0] && results[1]) {
        db.multi()
          .sadd(`Credits.${server.id}:members`, author.id)
          .sadd(`Credits.${author.id}:guilds`, server.id);
        .incrby(`Credits.${server.id}:member:${author.id}:credits`, 10);
        .setex(`Credits.${server.id}:member:${author.id}:check`, 60, 1)
          .set(`Credits.${server.id}:member:${author.id}:name`, author.username)
          .set(`Credits.${server.id}:member:${author.id}:discriminator`, author.discriminator)
          .set(`Credits.${server.id}:member:${author.id}:avatar`, author.avatar || "https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png")
          .sort(`Credits.${author.id}:guilds`, "BY", "NOSORT", "GET", `Credits.*:member:${author.id}:credits`)
          .exec((err, res) => {
            if (!err) {
              var sum = 0;
              for (const additive in res[7]) {
                sum += parseInt(res[7][additive], 10);
              }
              db.set(`Credits.${author.id}:credits`, sum)
            }
            if (err) console.log(err)
          })
      }
    })
}


class giveCredit extends lib.Command {
  constructor(plugin) {
    super("giveCredits", false, plugin, { description: "Gives a user credits" });
    this.setAlias(["giveCredits", "givec"]);
    this.role = "@everyone";
    this.usage = "giveCredits <Person> <number of credits>";
  }
  Message(message, author, channel, server) {
    var Args = message.content.split(' ');
    if (Args.length == 1 || Args.length == 2) {
      channel.sendMessage("I need a user to give credits to.\nUsage: `##givecredits @Person credits`");
    } else if (Args.length >= 3) {
      if (message.mentions.users.size > 0) {
        async.series({
          isRole: (cb) => {
            db.get(`Credits.${server.id}:role`, (err, role) => {
              if (err) {
                cb(err)
                return
              }
              if (author.id === "104063667351322624") {
                cb(null, true)
                return
              }
              if (role != null) {
                if (lib.isRoleServer(message.member, role)) {
                  cb(null, true);
                  return;
                }
              }
              if (lib.hasPerms(message.member, "MANAGE_GUILD")) {
                cb(null, true);
                return;
              }
              cb(null, false);
            })
          }
        }, (err, res) => {
          if (err) {
            console.log(err)
            return
          }
          if (res.isRole) {
            db.sadd(`Credits.${server.id}:members`, message.mentions.users.first().id)
            db.incrby(`Credits.${server.id}:member:${message.mentions.users.first().id}:credits`, parseInt(Args[2], 10));
            db.setex(`Credits.${server.id}:member:${message.mentions.users.first().id}:check`, 60, 1)
            db.set(`Credits.${server.id}:member:${message.mentions.users.first().id}:name`, message.mentions.users.first().username)
            db.set(`Credits.${server.id}:member:${message.mentions.users.first().id}:discriminator`, message.mentions.users.first().discriminator)
            db.set(`Credits.${server.id}:member:${message.mentions.users.first().id}:avatar`, message.mentions.users.first().avatar)
            channel.sendMessage(`I gave <@${message.mentions.users.first().id}> **${Args[2]}** credit(s)`);
          } else {
            channel.sendMessage("you don't have permission to give people credits")
          }
        });
      } else {
        message.reply("You didn't mention anyone");
      }
    }
  }
}

class setAuto extends lib.Command {
  constructor(plugin) {
    super("setAuto", null, plugin, { caseSensitive: false })
    this.setAlias(["setAuto", "sauto", "seta"]);
    this.role = "@everyone"
  }
  Message(message, author, channel, server) {
    async.series({
      isRole: (cb) => {
        db.get(`Credits.${server.id}:role`, (err, role) => {

          if ( /*lib.isRoleServer(author, server, role) ||*/ lib.hasPerms(message.member, "MANAGE_GUILD") || author.id === "104063667351322624") {
            cb(null, true);
            return;
          }
          cb(null, false);
        })
      }
    }, (err, res) => {
      if (res.isRole) {
        db.get(`Credits.${server.id}:autoGive`, (Err, res) => {
          db.set(`Credits.${server.id}:autoGive`, !res);
          channel.sendMessage(`I set automatic credit dispencing to **${!res}**`);
        })
      }
    });
  }

}
class setRole extends lib.Command {
  constructor(plugin) {
    super("setRole", null, plugin, { names: ["setcreditrole", "scr", "setrolecredits", "src", "creditrole"], caseSensitive: false });
    this.role = "@everyone"
    this.Message = (message, author, channel, server) => {
      var Args = message.content.split(" ");
      if (Args.length < 2) {
        channel.sendMessage("I'm sorry but, i need more arguments to run this command")
        return;
      }

      db.get(`Credits.${server.id}:role`, (err, role) => {
        if (lib.hasRole(message.member, role) || lib.hasPerms(message.member, "MANAGE_GUILD")) {
          db.set(`Credits.${server.id}:role`, Args[1].toLowerCase());
          channel.sendMessage(`I set the credit management role to **${Args[1]}**`);
        }
      });
    }
  }
}



class viewCredit extends lib.Command {
  constructor(plugin) {
    super("viewCredits", null, plugin, { names: ["credits", "viewcredits"], caseSensitive: false });
    this.description = "Shows you how many credits you have";
    this.role = "@everyone"
  }
  Message(message, author, channel, server) {
    db.get(`Credits.${server.id}:member:${author.id}:credits`, (err, res) => {
      if (err) console.log(err)
      if (res == null || res == 0) {
        channel.sendMessage("Sorry but you don't have any credits")
      } else {
        channel.sendMessage(`You have **${res}** credit(s)`);
      }
    });
  }

}


class convertCredits {
  constructor(plugin) {

    this.plugin = plugin;
    this.id = "convertCredits";
    this.desc = "Converts old credits to the new Credits system(Note: if not done you lose your old credits)"
    this.names = ["convertCredits", "convertc", "cCredits"];
  }

  func(bot, message, author, channel, server) {
    if (fs.existsSync(`./credits/${server.id}.json`)) {
      const oldGuild = lib.openJSON(`./credits/${server.id}.json`);
      let totalOld = 0
      oldGuild.members.forEach(member => {
        totalOld += member.credits;
        db.sadd(`Credits.${server.id}:members`, member.id);
        db.incrby(`Credits.${server.id}:member:${member.id}:credits`, (-1 * member.credits) || 0);
      })
      fs.unlinkSync(`./credits/${server.id}.json`);
      channel.sendMessage(`Added a total of **${totalOld}** credits back to the users`);
    }
  }
}


class myCredits {
  constructor(plugin) {
    this.plugin = plugin;
    this.id = "myCredits";
    this.desc = "testing stuff";
    this.names = ["myCredits"];
  }

  func(bot, message, author, channel, server) {
    for (var i = 0; i < message.client.guilds.length; i++) {

    }
  }
}



class listRewards extends lib.Command {
  constructor(plugin) {
    super("listRewards", null, plugin, { caseSensitive: false });
    this.description = "The available rewards for this guild. Use your saved up credits to buy them.";
    // this.caseSensitive = false;
  }

  Message(message, author, channel, guild, registry, guilds) {
    const rewards = [];
    guilds.get(guild.id).roles.forEach(role => {
      rewards.push(this.getRewards(guilds.get(guild.id), role));
    });
    Promise.all(rewards).then(Rewards => {
      const rewardList = [];

      Rewards.forEach(reward => {
        // console.log(typeof reward.pre);
        const pre = reward.pre === "None" ? "None" : reward.pre.name;
        if (reward.price != 0) rewardList.push(`Reward: **${reward.name}**, Price: **¥${reward.price}**, Requires: **${pre}**`);
      });

      channel.sendMessage(rewardList.join('\n'));

    }).catch(e => {
      console.log("Why you reject", e);
    });
  }

  getRewards(guild, role) {
    return new Promise((resolve, reject) => {
      // console.log(guild.id, role.id)
      db.multi()
        .get(`Guilds.${guild.id}:roles.${role.id}:price`)
        .get(`Guilds.${guild.id}:roles.${role.id}:pre`)
        .exec((err, results) => {
          if (err) return reject(err);
          role.price = results[0] || 0;
          role.pre = guild.roles.has(results[1]) ? guild.roles.get(results[1]) : "None";

          resolve(role);
        })
    })
  }
}

class buyReward extends lib.Command {
  constructor(plugin) {
    super("buyReward", null, plugin, { caseSensitive: false });
    this.description = "Buy dem rewards!1";
  }
  Message(message, author, channel, guild, registry, guilds) {
    const filter = m => m.content.split(" ")[0] == `${registry.guilds.get(guild.id).prefix}reward` && m.author.id == author.id;
    const rewards = [];
    guilds.get(guild.id).roles.forEach(role => {
      rewards.push(this.getRewards(guilds.get(guild.id), role));
    });
    Promise.all(rewards).then(Rewards => {
      const rewardList = [`Type \`${registry.guilds.get(guild.id).prefix}reward <number>\`\n`];
      const availableRewards = new Map();
      let n = 1;
      Rewards.forEach(reward => {
        const pre = reward.pre === "None" ? "None" : reward.pre.name;
        if (reward.price != 0 && !message.member.roles.has(reward.id)) {
          rewardList.push(`**${n}**: Reward: **${reward.name}**, Price: **¥${reward.price}**, Requires: **${pre}**`);
          availableRewards.set(n.toString(), reward);
          n++;
        }
      });

      if (rewardList.length == 1) return channel.sendMessage("You don't have any available rewards");
      if (collectors.has(author.id)) return;

      channel.sendMessage(rewardList.join('\n'));

      collectors.set(author.id, "Wow");

      channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] }).then(collected => {
        const Reward = availableRewards.get(collected.first().content.split(" ")[1]);
        console.log(Reward != null, collected.first().content.split(" ")[1]);
        if (Reward) {
          db.get(`Credits.${guild.id}:member:${author.id}:credits`, (err, credits) => {
            if (err) return channel.sendMessage("Something went wrong, I am unable to complete your purchase");
            if (credits >= Reward.price) {
              console.log("has enough")
              if (message.member.roles.has(Reward.pre.id) || Reward.pre === "None") {
                db.decrby(`Credits.${guild.id}:member:${author.id}:credits`, Reward.price)
                message.member.addRole(Reward.id).then(() => {
                  channel.sendMessage(`Thank you for purchasing the **${Reward.name}** reward.\n${Reward.price} has been subtracted from your account.`);
                  collectors.delete(author.id);
                }).catch(err => {
                  console.log(err);
                  channel.sendMessage(`I do not have permission to give the reward.\nContact an admin to have them give you the role.\n${Reward.price} has been subtracted from your account.`);
                  collectors.delete(author.id);
                });
              }
            }
          })
        }
      }).catch(err => {
        console.log(err);
        collectors.delete(author.id);
      });
    }).catch(e => {
      console.log("Why you reject", e);
    });
  }

  getRewards(guild, role) {
    return new Promise((resolve, reject) => {
      // console.log(guild.id, role.id)
      db.multi()
        .get(`Guilds.${guild.id}:roles.${role.id}:price`)
        .get(`Guilds.${guild.id}:roles.${role.id}:pre`)
        .exec((err, results) => {
          if (err) return reject(err);
          role.price = results[0] || 0;
          role.pre = guild.roles.has(results[1]) ? guild.roles.get(results[1]) : "None";

          resolve(role);
        })
    })
  }
}


module.exports = class commands extends EventEmitter {
  constructor(plugin) {
    super();
    this.plugin = plugin;
  }

  register() {
    this.plugin.registerCommand(new viewCredit(this.plugin));
    this.plugin.registerCommand(new giveCredit(this.plugin));
    this.plugin.registerCommand(new setAuto(this.plugin));
    this.plugin.registerCommand(new setRole(this.plugin));
    this.plugin.registerCommand(new listRewards(this.plugin));
    this.plugin.registerCommand(new buyReward(this.plugin));
    this.plugin.on("message", (msg) => {
      handleMessage(msg, msg.author, msg.channel, msg.guild);
    });
  }
}
