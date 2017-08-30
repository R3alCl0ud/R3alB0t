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
			if (!DataBase.getClient().exists(Currency.userCooldown(e.getGuild().getID(), author.getID()))) {
				String s = DataBase.getClient().get(Currency.coolDown(e.getGuild().getID())), in = DataBase.getClient().get(Currency.interest(e.getGuild().getID()));
				if (s == null) {
					DataBase.getClient().set(Currency.coolDown(e.getGuild().getID()), "120");
				}
				if (in == null) {
					DataBase.getClient().set(Currency.interest(e.getGuild().getID()), "10");
				}
				int cooldown = s == null ? 120 : Integer.parseInt(s, 10);
				long payout = in == null ? 10 : Integer.parseInt(in, 10);
				AccountJSON account = null;
				if (!DataBase.getClient().sismember(Currency.users(guild.getID()), SnowflakeUtil.asString(author))) {
					DataBase.getClient().sadd(Currency.users(guild.getID()), SnowflakeUtil.asString(author));
				}
				if (!DataBase.getClient().exists(Currency.userBal(guild.getID(), author.getID()))) {
					DataBase.getClient().set(Currency.userBal(guild.getID(), author.getID()), (account = new AccountJSON(author)).toString());
				} else {
					account = DLUtil.gson.fromJson(DataBase.getClient().get(Currency.userBal(guild.getID(), author.getID())), AccountJSON.class);
				}
				account.setBalance(account.getBalance() + payout);
				DataBase.getClient().set(Currency.userBal(e.getGuild().getID(), author.getID()), account.toString());
				DataBase.getClient().setex(Currency.userCooldown(e.getGuild().getID(), author.getID()), cooldown, "spicy");
			}
		}
	}
	
}
