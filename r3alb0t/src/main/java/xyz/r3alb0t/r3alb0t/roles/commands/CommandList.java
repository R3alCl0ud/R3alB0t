package xyz.r3alb0t.r3alb0t.roles.commands;

import java.util.List;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.message.embed.RichEmbed;
import io.discloader.discloader.entity.guild.IGuild;
import xyz.r3alb0t.r3alb0t.R3alB0t;
import xyz.r3alb0t.r3alb0t.roles.RankJSON;
import xyz.r3alb0t.r3alb0t.roles.Roles;

public class CommandList extends Command {
	public CommandList() {
		super();
		setUnlocalizedName("list");
		setUsage("roles list");
	}
	
	@Override
	public void execute(MessageCreateEvent e) {
		IGuild guild = e.getMessage().getGuild();
		if (guild == null) {
			return;
		}
		List<RankJSON> ranks = Roles.getRanks(guild);
		RichEmbed embed = new RichEmbed("Ranks").setFooter(R3alB0t.getCopyrightInfo()).setTimestamp();
		embed.setColor(0xc23456).setDescription("Displaying the server's ranks.").setThumbnail(guild.getIcon().toString());
		for (RankJSON rank : ranks) {
			if (rank.getLevel() != 0) {
				embed.addField(rank.getLevel() == 1 ? "Default Rank" : "Level: " + rank.getLevel(), rank.getName(), true);
			}
		}
		if (embed.getFields().size() == 0) {
			embed.addField("No Ranks", "No Ranks could be found", true);
		}
		e.getChannel().sendEmbed(embed);
	}
}
