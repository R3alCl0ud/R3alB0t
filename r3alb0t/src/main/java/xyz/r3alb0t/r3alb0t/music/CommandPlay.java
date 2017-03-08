package xyz.r3alb0t.r3alb0t.music;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.command.CommandHandler;
import io.discloader.discloader.common.event.MessageCreateEvent;

public class CommandPlay extends Command {
	public CommandPlay() {
		setUnlocalizedName("play");
		setDescription("adds a track/set to the playlist\nCurrently only works with YouTube");
	}

	private final String regex = String.format("%splay (.*)", CommandHandler.prefix);
	private final Pattern pattern = Pattern.compile(regex);

	public void execute(MessageCreateEvent e) {
		// RichEmbed embed = new RichEmbed().setColor(0x55cdF2);
		if (e.message.guild != null && e.loader.voiceConnections.containsKey(e.message.guild.id)) {
			Matcher track = pattern.matcher(e.message.content);
			if (track.find()) {
				String trackID = track.group(1);
				e.loader.voiceConnections.get(e.message.guild.id).play(trackID);
			}
		} else {

		}
	}
}
