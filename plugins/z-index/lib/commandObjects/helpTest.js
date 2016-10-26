const lib = require('../../../../lib');

module.exports = class help extends lib.Command {
    constructor(plugin) {
        super("help", null, plugin, {caseSensitive: false});
    }
    
    Message (message, author, channel, guild, registry, guilds, channels, users) {
        const Guild = registry.guilds.get(guild.id);
        const helpMSG = ["**Help List**", `type \`${Guild.prefix}help <command>\` To view the decription of a command\n`];
        
        if (Guild.commands.size > 0) {
            helpMSG.push("**Custom Commands**");
            Guild.commands.forEach(command => {
                helpMSG.push(`    **${command.id}**`);
            });
        }
        
        Guild.enabledPlugins.forEach(plugin => {
            if (!registry.plugins.has(plugin)) return;
            
            const Plugin = registry.plugins.get(plugin);
            helpMSG.push(`**${Plugin.name}**`);
            
            Plugin.commands.forEach(command => {
                helpMSG.push(`    **${command.id}**`);
            })
        });
        
        channel.sendMessage(helpMSG.join('\n'));
        
    }
}