package xyz.r3alb0t.r3alb0t.common.commands;

import java.time.OffsetDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
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
		if (guild == null) return;
		ITextChannel channel = event.getChannel();
		RichEmbed embed = new RichEmbed(guild.getName()).setColor(0x427df4);
		embed.setDescription("Created on " + ZonedDateTime.from(guild.createdAt()).format(DateTimeFormatter.ofPattern("d MMM uuuu 'at' h:mma ZZZZ", Locale.US)));
		embed.addField("Owner", guild.getOwner().toString(), true);
		embed.addField("Members", String.format("%d/%d", guild.getMembers().size(), guild.getMemberCount()), true);
		embed.addField("Text Channels", "" + guild.getTextChannels().size(), true).addField("Voice Channels", "" + guild.getVoiceChannels().size(), true);
		embed.setTimestamp(OffsetDateTime.now());
		embed.setThumbnail(guild.getIcon().toString());
		embed.setFooter(String.format("Guild ID: %d", guild.getID()));
		channel.sendEmbed(embed);
		
	}
	
}
