package xyz.r3alb0t.r3alb0t.common.commands;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.message.embed.RichEmbed;
import io.discloader.discloader.entity.channel.ITextChannel;
import io.discloader.discloader.entity.guild.IGuild;

/**
 * @author Perry Berman
 */
public class CommandServerInfo extends Command {

	public CommandServerInfo() {
		setUnlocalizedName("serverinfo");
	}

	public void execute(MessageCreateEvent event, String[] args) {
		IGuild guild = event.getMessage().getGuild();
		if (guild == null)
			return;
		ITextChannel channel = event.getChannel();
		RichEmbed embed = new RichEmbed(guild.getName()).setColor(0x427df4);
		embed.setDescription("Created on " + ZonedDateTime.from(guild.createdAt()).format(DateTimeFormatter.ofPattern("d MMMM uuuu 'at' h:mma ZZZZ", Locale.US)));
		embed.addField("Owner", guild.getOwner().toString(), true);
		embed.addField("Members Online", String.format("%d of %d", guild.getMembers().size(), guild.getMemberCount()), true);
		String tcs = "";
		int i = 0;
		for (long id : guild.getTextChannels().keySet()) {
			tcs += guild.getTextChannelByID(id).getName();
			if (i < guild.getTextChannels().size() - 1) {
				tcs += ", ";
			}
			i++;
		}
		String vcs = "";
		i = 0;
		for (long id : guild.getVoiceChannels().keySet()) {
			vcs += guild.getVoiceChannelByID(id).getName();
			if (i < guild.getVoiceChannels().size() - 1) {
				vcs += ", ";
			}
			i++;
		}
		String ccs = "";
		i = 0;
		for (long id : guild.getChannelCategories().keySet()) {
			ccs += guild.getChannelCategoryByID(id).getName();
			if (i < guild.getChannelCategories().size() - 1) {
				ccs += ", ";
			}
			i++;
		}
		String rcs = "";
		i = 0;
		for (long id : guild.getRoles().keySet()) {
			rcs += guild.getRoleByID(id).getName();
			if (i < guild.getRoles().size() - 1) {
				rcs += ", ";
			}
			i++;
		}
		embed.addField("Text Channels", tcs, true).addField("Voice Channels", vcs, true);
		embed.addField("Categories", ccs, true).addField("Roles", rcs, true);
		embed.setTimestamp();
		embed.setThumbnail(guild.getIcon().toString());
		embed.setFooter(String.format("Guild ID: %d", guild.getID()));
		channel.sendEmbed(embed);

	}

}
