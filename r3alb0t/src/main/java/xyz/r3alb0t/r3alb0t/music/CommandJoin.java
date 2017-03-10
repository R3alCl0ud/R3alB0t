package xyz.r3alb0t.r3alb0t.music;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.MessageCreateEvent;
import io.discloader.discloader.entity.RichEmbed;
import io.discloader.discloader.entity.channels.TextChannel;
import io.discloader.discloader.entity.channels.VoiceChannel;
import io.discloader.discloader.entity.guild.GuildMember;

public class CommandJoin extends Command {
	public CommandJoin() {
		setUnlocalizedName("join");
	}

	public void execute(MessageCreateEvent e, String[] args) {
		GuildMember member = e.message.member;
		if (member != null) {
			VoiceChannel channel = member.getVoiceChannel();
			if (channel != null && !e.loader.voiceConnections.containsKey(e.message.guild.id)) {
				channel.join().thenAcceptAsync(connection -> {
					PlaylistManager pl = new PlaylistManager(connection, (TextChannel) e.message.channel);
					RBMusic.plManagers.put(e.message.guild.id, pl);
					RichEmbed embed = new RichEmbed("Music Player").setColor(0x55cdF2);
					embed.addField("Joined Voice", String.format("Joined the VoiceChannel *%s*", channel.name));
					e.message.channel.sendEmbed(embed);
				}).exceptionally(ex -> null);
			} else {
				RichEmbed embed = new RichEmbed("Music Player").setColor(0x55cdF2);
				embed.addField("Error",
						"Either you are not in a voice channel, or I am already connected to another VoiceChannel");
				e.message.channel.sendEmbed(embed);
			}
		}
	}

}
