package xyz.r3alb0t.r3alb0t.currency.commands;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.util.SnowflakeUtil;
import xyz.r3alb0t.r3alb0t.currency.Currency;
import xyz.r3alb0t.r3alb0t.util.DataBase;

/**
 * @author Perry Berman
 *
 */
public class CommandDisable extends Command {
	
	/**
	 * 
	 */
	public CommandDisable() {
		setUnlocalizedName("disable");
		setDescription("Disables automatic credit dispencing");
		setUsage("currency disable");
	}
	
	public void execute(MessageCreateEvent e, String[] args) {
		IGuild guild = e.getMessage().getGuild();
		if (guild == null) return;
		DataBase.getClient().srem("currency.guilds", SnowflakeUtil.asString(guild));
		Currency.getGuilds().remove(guild.getID());
		e.getChannel().sendMessage("Automated credit dispencing disabled");
	}
	
}
