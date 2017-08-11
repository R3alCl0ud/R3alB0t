package xyz.r3alb0t.r3alb0t.currency.commands;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.guild.IGuild;
import xyz.r3alb0t.r3alb0t.currency.Currency;
import xyz.r3alb0t.r3alb0t.util.DataBase;

/**
 * @author Perry Berman
 */
public class CommandEnable extends Command {

	/**
	 * 
	 */
	public CommandEnable() {
		setUnlocalizedName("enable");
	}

	public void execute(MessageCreateEvent e, String[] args) {
		for (String arg : args)
			System.out.println(arg + "test");
		System.out.println("enabled");
		IGuild guild = e.getMessage().getGuild();
		if (guild == null) return;
		DataBase.getDataBase().sadd("currency.guilds", Long.toUnsignedString(guild.getID(), 10));
		Currency.getGuilds().add(guild.getID());
		e.getChannel().sendMessage("Automated credit dispencing enabled");
	}

}
