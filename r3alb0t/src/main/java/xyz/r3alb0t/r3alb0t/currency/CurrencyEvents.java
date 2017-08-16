package xyz.r3alb0t.r3alb0t.currency;

import io.discloader.discloader.client.command.CommandHandler;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.message.GuildMessageCreateEvent;
import io.discloader.discloader.entity.user.IUser;
import xyz.r3alb0t.r3alb0t.util.DataBase;

/**
 * @author Perry Berman
 */
public class CurrencyEvents extends EventListenerAdapter {

	@Override
	public void GuildMessageCreate(GuildMessageCreateEvent e) {

		if (Currency.getGuilds().contains(e.getGuild().getID())) {
			IUser author = e.getMessage().getAuthor();
			if (author.isBot() || e.getMessage().getContent().equalsIgnoreCase(CommandHandler.prefix + "balance")) return;
			if (!DataBase.getDataBase().exists(Currency.userCooldown(e.getGuild().getID(), author.getID()))) {
				String s = DataBase.getDataBase().get(Currency.coolDown(e.getGuild().getID())), in = DataBase.getDataBase().get(Currency.interest(e.getGuild().getID()));
				;
				if (s == null) {
					DataBase.getDataBase().set(Currency.coolDown(e.getGuild().getID()), "120");
				}
				if (in == null) {
					DataBase.getDataBase().set(Currency.interest(e.getGuild().getID()), "10");
				}
				int cooldown = s == null ? 120 : Integer.parseInt(s, 10);
				long interest = in == null ? 10 : Integer.parseInt(in, 10);
				DataBase.getDataBase().incrBy(Currency.userBal(e.getGuild().getID(), author.getID()), interest);
				DataBase.getDataBase().setex(Currency.userCooldown(e.getGuild().getID(), author.getID()), cooldown, "spicy");
			}
		}
	}

}
