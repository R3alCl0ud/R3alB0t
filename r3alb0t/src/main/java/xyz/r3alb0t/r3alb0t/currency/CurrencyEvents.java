package xyz.r3alb0t.r3alb0t.currency;

import io.discloader.discloader.client.command.CommandHandler;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.message.GuildMessageCreateEvent;
import io.discloader.discloader.entity.user.IUser;
import xyz.r3alb0t.r3alb0t.util.DataBase;

/**
 * @author Perry Berman
 *
 */
public class CurrencyEvents extends EventListenerAdapter {
	
	// private static Jedis db = DataBase.getDataBase();
	
	public CurrencyEvents() {
	}
	
	@Override
	public void GuildMessageCreate(GuildMessageCreateEvent e) {
		
		if (Currency.getGuilds().contains(e.getGuild().getID())) {
			// System.out.println(CommandHandler.prefix + "balance");
			IUser author = e.getMessage().getAuthor();
			if (author.isBot() || e.getMessage().getContent().equalsIgnoreCase(CommandHandler.prefix + "balance")) return;
			if (!DataBase.getDataBase().exists(Currency.userCooldown(e.getMessage().getGuild().getID(), author.getID()))) {
				DataBase.getDataBase().incrBy(Currency.userBal(e.getMessage().getGuild().getID(), author.getID()), 10l);
				DataBase.getDataBase().setex(Currency.userCooldown(e.getMessage().getGuild().getID(), author.getID()), 120, "spicy");
			}
		}
	}
	
}
