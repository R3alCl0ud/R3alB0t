package xyz.r3alb0t.r3alb0t.music;

import com.sedmelluq.discord.lavaplayer.player.AudioPlayer;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.message.IMessage;

/**
 * @author Perry Berman
 *
 */
public class CommandVolume extends Command {
	public CommandVolume() {
		setUnlocalizedName("volume");
		setArgsRegex("(\\d+)");
	}
	
	@Override
	public void execute(MessageCreateEvent e, String[] args) {
		IMessage message = e.getMessage();
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7);
		if (message.getGuild() != null && e.loader.voiceConnections.containsKey(message.getGuild().getID())) {
			AudioPlayer player = e.loader.voiceConnections.get(message.getGuild().getID()).player;
			if (args.length > 0) {
				int volume = Integer.parseInt(args[0], 10);
				player.setVolume(volume);
				embed.addField("Volume", String.format("Volume set to *%d*", volume) + "%");
			} else {
				embed.addField("Volume", String.format("Volume is currently *%d*", player.getVolume()) + "%");
			}
		} else {
			embed.addField("Error", "There is no music player instance for this guild, or command was received in a private message");
		}
		message.getChannel().sendEmbed(embed);
	}
}
