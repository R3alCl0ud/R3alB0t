package xyz.r3alb0t.r3alb0t.logs.commands;

import java.util.HashMap;
import java.util.Map;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.command.CommandTree;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.channel.ChannelTypes;
import io.discloader.discloader.entity.guild.IGuild;
import xyz.r3alb0t.r3alb0t.R3alB0t;
import xyz.r3alb0t.r3alb0t.logs.LogHandler;

public class CommandEnable extends CommandTree {

	private Map<String, Command> subs;

	public CommandEnable() {
		super("enable");
		subs = new HashMap<>();
		setDescription("enables logging for the guild");
	}

	public void defaultResponse(MessageCreateEvent e) {
		if (e.getChannel().getType() != ChannelTypes.TEXT) {
			RichEmbed embed = new RichEmbed("Enable Logging").setColor(0xff0101).addField("Error", "This command can only be executed in a **GuildTextChannel**").setTimestamp();
			embed.setFooter("© R3alB0t " + R3alB0t.getYear());
			e.getChannel().sendEmbed(embed);
			return;
		}
		IGuild guild = e.getMessage().getGuild();
		if (LogHandler.enabledGuilds.containsKey(guild.getID())) {

		}
	}

	public Map<String, Command> getSubCommands() {
		return subs;
	}
}
