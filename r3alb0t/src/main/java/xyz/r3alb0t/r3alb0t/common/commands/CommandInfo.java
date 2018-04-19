package xyz.r3alb0t.r3alb0t.common.commands;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.common.registry.EntityRegistry;
import io.discloader.discloader.core.entity.RichEmbed;
import xyz.r3alb0t.r3alb0t.R3alB0t;

/**
 * @author Perry Berman
 *
 */
public class CommandInfo extends Command {

	public CommandInfo() {
		setUnlocalizedName("info");
	}

	public void execute(MessageCreateEvent event, String[] args) {
		RichEmbed embed = new RichEmbed("General Information").setColor(0x42f46b);
		embed.setDescription("Displaying information about R3alB0t");
		embed.setThumbnail(event.getLoader().getSelfUser().getAvatar().toString());
		embed.addField("Username", event.getLoader().getSelfUser().toString(), true);
		embed.addField("Servers", "Connected to " + EntityRegistry.getGuildsOnShard(event.getLoader().getShard()).size() + " of " + EntityRegistry.getGuilds().size() + " server(s)", true);
		embed.addField("Users", "Serving a total of " + EntityRegistry.getUsers().size() + " user(s)", true);
		embed.addField("Shard Number", "" + (event.getLoader().shardid + 1) + " of " + event.getLoader().shards, true);
		embed.addField("Website", "https://r3alb0t.xyz", true).addField("Discord Server", "https://discord.gg/012fGm4RhRlUxlLG5", true);
		embed.setTimestamp();
		embed.setFooter(R3alB0t.getCopyrightInfo());
		event.getChannel().sendEmbed(embed);
	}
}
