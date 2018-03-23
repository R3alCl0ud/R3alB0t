package xyz.r3alb0t.r3alb0t.currency.commands;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.message.MessageBuilder;
import io.discloader.discloader.entity.message.MessageBuilder.Formatting;
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
		if (guild == null)
			return;
		DataBase.getClient().sadd("currency.guilds", Long.toUnsignedString(guild.getID(), 10));
		Currency.getGuilds().add(guild.getID());
		MessageBuilder builder = new MessageBuilder(e.getChannel());
		builder.append("Currency: ").code("enabled").append('.').newLine().newLine().append("DISCLAIMER", Formatting.UNDERLINE, Formatting.BOLD).newLine();
		builder.append("By enabling currency on the guild ").code(guild.getName()).append(", you have given explicit permission for ").mention(e.getLoader().user).append(" to store ").italics("End User Data");
		builder.sendMessage();
	}

}
