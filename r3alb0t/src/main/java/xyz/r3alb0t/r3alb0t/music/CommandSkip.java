package xyz.r3alb0t.r3alb0t.music;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;

public class CommandSkip extends Command {

	public CommandSkip() {
		setUnlocalizedName("skip");

	}

	@Override
	public void execute(MessageCreateEvent e, String[] args) {
		
	}
}
