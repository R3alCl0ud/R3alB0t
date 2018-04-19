package xyz.r3alb0t.r3alb0t.common.commands;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;

/**
 * @author Perry Berman
 *
 */
public class CommandInvite extends Command {
	
	public CommandInvite() {
		setUnlocalizedName("invite");
		setDescription("Gives you a link to where you can invite the bot to your server");
	}
	
	public void execute(MessageCreateEvent e) {
		e.getChannel().sendMessage("Invite me to your server at https://r3alb0t.xyz");
	}
	
}
