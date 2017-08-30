package xyz.r3alb0t.r3alb0t.common.commands;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.emoji.Emojis;


public class CommandTest extends Command {
	public CommandTest() {
		setUnlocalizedName("test");
	}
	
	public void execute(MessageCreateEvent e, String[] args) {
		e.getChannel().sendMessage(Emojis.getEmoji("cop").toString());
	}
}
