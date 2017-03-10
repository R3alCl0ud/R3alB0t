package xyz.r3alb0t.r3alb0t.music;

import com.sedmelluq.discord.lavaplayer.player.AudioPlayer;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.MessageCreateEvent;
import io.discloader.discloader.entity.RichEmbed;
import io.discloader.discloader.entity.message.Message;

/**
 * @author Perry Berman
 *
 */
public class CommandVolume extends Command {
	public CommandVolume() {
		setUnlocalizedName("volume");
		setArgsRegex("(\\d+)");
	}

	public void execute(MessageCreateEvent e, String[] args) {
		Message message = e.message;
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7);
		if (message.guild != null && e.loader.voiceConnections.containsKey(message.guild.id)) {
			AudioPlayer player = e.loader.voiceConnections.get(message.guild.id).player;
			if (args.length > 0) {
				int volume = Integer.parseInt(args[0], 10);
				player.setVolume(volume);
				embed.addField("Volume", String.format("Volume set to *%d*", volume) + "%");
			} else {
				embed.addField("Volume", String.format("Volume is currently *%d*", player.getVolume()) + "%");
			}
		} else {
			embed.addField("Error",
					"There is no music player instance for this guild, or command was received in a private message");
		}
		e.message.channel.sendEmbed(embed);
	}
}
