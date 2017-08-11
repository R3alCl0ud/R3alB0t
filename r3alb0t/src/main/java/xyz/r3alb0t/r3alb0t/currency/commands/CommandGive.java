package xyz.r3alb0t.r3alb0t.currency.commands;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.guild.IGuild;

public class CommandGive extends Command {

	public CommandGive() {
		super();
		setUnlocalizedName("give");
		setUsage("currency give @user amount");
		setArgsRegex("<(@\\d+|@!\\d+)> (\\d+)");
		// this.getArgsPattern().
	}

	public void execute(MessageCreateEvent e, String[] args) {
		IGuild guild = e.getMessage().getGuild();
		if (guild == null) return;
		System.out.println(args.length);
		if (args.length < 2) {
			e.getChannel().sendMessage(this.getUsage());
		} else {
			e.getChannel().sendMessage(args[1]);
		}
	}
}
