package xyz.r3alb0t.r3alb0t.currency;

import io.discloader.discloader.client.command.CommandHandler;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.message.GuildMessageCreateEvent;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.user.IUser;
import io.discloader.discloader.entity.util.SnowflakeUtil;
import io.discloader.discloader.util.DLUtil;
import xyz.r3alb0t.r3alb0t.util.DataBase;

/**
 * @author Perry Berman
 */
public class CurrencyEvents extends EventListenerAdapter {
	
	@Override
	public void GuildMessageCreate(GuildMessageCreateEvent e) {
		IGuild guild = e.getGuild();
		if (Currency.getGuilds().contains(guild.getID())) {
			IUser author = e.getMessage().getAuthor();
			if (author.isBot() || e.getMessage().getContent().equalsIgnoreCase(CommandHandler.prefix + "balance")) return;
			if (!DataBase.getDataBase().exists(Currency.userCooldown(e.getGuild().getID(), author.getID()))) {
				String s = DataBase.getDataBase().get(Currency.coolDown(e.getGuild().getID())), in = DataBase.getDataBase().get(Currency.interest(e.getGuild().getID()));
				if (s == null) {
					DataBase.getDataBase().set(Currency.coolDown(e.getGuild().getID()), "120");
				}
				if (in == null) {
					DataBase.getDataBase().set(Currency.interest(e.getGuild().getID()), "10");
				}
				int cooldown = s == null ? 120 : Integer.parseInt(s, 10);
				long payout = in == null ? 10 : Integer.parseInt(in, 10);
				AccountJSON account = null;
				if (!DataBase.getDataBase().sismember(Currency.users(guild.getID()), SnowflakeUtil.asString(author))) {
					DataBase.getDataBase().sadd(Currency.users(guild.getID()), SnowflakeUtil.asString(author));
				}
				if (!DataBase.getDataBase().exists(Currency.userBal(guild.getID(), author.getID()))) {
					DataBase.getDataBase().set(Currency.userBal(guild.getID(), author.getID()), (account = new AccountJSON(author)).toString());
				} else {
					account = DLUtil.gson.fromJson(DataBase.getDataBase().get(Currency.userBal(guild.getID(), author.getID())), AccountJSON.class);
				}
				account.setBalance(account.getBalance() + payout);
				DataBase.getDataBase().set(Currency.userBal(e.getGuild().getID(), author.getID()), account.toString());
				DataBase.getDataBase().setex(Currency.userCooldown(e.getGuild().getID(), author.getID()), cooldown, "spicy");
			}
		}
	}
	
}
