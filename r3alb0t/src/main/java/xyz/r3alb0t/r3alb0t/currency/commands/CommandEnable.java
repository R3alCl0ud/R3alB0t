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
		setDescription("Enables Currency system on this guild");
		setUsage("currency enable");
	}

	public void execute(MessageCreateEvent e, String[] args) {
		IGuild guild = e.getMessage().getGuild();
		if (guild == null) return;
		DataBase.getDataBase().sadd("currency.guilds", Long.toUnsignedString(guild.getID(), 10));
		Currency.getGuilds().add(guild.getID());
		e.getChannel().sendMessage("Currency: `enabled`.\n\n__**DISCLAIMER**__\nBy enabling currency on the guild `" + guild.getName()+"`, you have given explicit permission for " + e.getLoader().user.asMention() + " to store *End User Data*");
	}

}