package xyz.r3alb0t.r3alb0t.music;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;

public class CommandNowPlaying extends Command {

	public CommandNowPlaying() {
		super();
		setUnlocalizedName("nowplaying");
		setDescription("Displays the currently playing track");
	}

	public void execute(MessageCreateEvent e, String[] args) {

	}
}
