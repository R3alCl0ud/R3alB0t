package xyz.r3alb0t.r3alb0t.music;

import java.time.OffsetDateTime;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.common.registry.EntityRegistry;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.channel.IGuildVoiceChannel;
import io.discloader.discloader.entity.guild.IGuildMember;
import io.discloader.discloader.entity.message.IMessage;

public class CommandJoin extends Command {
	
	public CommandJoin() {
		setUnlocalizedName("join");
	}
	
	@Override
	public void execute(MessageCreateEvent e, String[] args) {
		IMessage message = e.getMessage();
		IGuildMember member = message.getMember();
		if (member != null) {
			IGuildVoiceChannel channel = member.getVoiceChannel();
			if (channel != null && !EntityRegistry.hasVoiceConnection(message.getGuild().getID())) {
				channel.join().thenAcceptAsync(connection -> {
					PlaylistManager pl = new PlaylistManager(connection, message.getChannel());
					RBMusic.plManagers.put(message.getGuild().getID(), pl);
					RichEmbed embed = new RichEmbed("Music Player").setColor(0x55cdF2);
					embed.setFooter("R3alB0t 2017").setTimestamp(OffsetDateTime.now());
					embed.addField("Joined Voice", String.format("Joined the VoiceChannel *%s*", channel.getName()));
					message.getChannel().sendEmbed(embed);
				}).exceptionally(ex -> {
					ex.printStackTrace();
					return null;
				});
			} else {
				RichEmbed embed = new RichEmbed("Music Player").setColor(0x55cdF2);
				embed.setFooter("R3alB0t 2017").setTimestamp(OffsetDateTime.now());
				embed.addField("Error", "Either you are not in a voice channel, or I am already connected to another VoiceChannel");
				message.getChannel().sendEmbed(embed);
			}
		}
	}
	
}
