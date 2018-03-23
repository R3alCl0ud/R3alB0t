package xyz.r3alb0t.r3alb0t.common.commands;

import java.time.OffsetDateTime;

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
		RichEmbed embed = new RichEmbed("Client Info").setColor(0x1010dd);
		embed.addField("Username", event.getLoader().user.getUsername(), true);
		embed.addField("Servers", "Connected to " + EntityRegistry.getGuildsOnShard(event.getLoader().getShard()).size() + "/" + EntityRegistry.getGuilds().size() + " server(s)", true);
		embed.setTimestamp(OffsetDateTime.now());
		embed.setFooter("© R3alB0t " + R3alB0t.getYear());
		event.getChannel().sendEmbed(embed);
	}
}
