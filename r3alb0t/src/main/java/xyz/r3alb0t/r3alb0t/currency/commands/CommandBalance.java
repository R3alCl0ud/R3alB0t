package xyz.r3alb0t.r3alb0t.currency.commands;

import java.time.OffsetDateTime;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.user.IUser;
import redis.clients.jedis.Jedis;
import xyz.r3alb0t.r3alb0t.currency.Currency;
import xyz.r3alb0t.r3alb0t.util.DataBase;

/**
 * @author Perry Berman
 *
 */
public class CommandBalance extends Command {
	
	private static Jedis db = DataBase.getDataBase();
	
	public CommandBalance() {
		setUnlocalizedName("balance");
	}
	
	public void execute(MessageCreateEvent e, String[] args) {
		IGuild guild = e.getMessage().getGuild();
		if (guild == null) {
			e.getChannel().sendMessage("This command can only be executed in a guild");
			return;
		}
		RichEmbed embed = new RichEmbed().setColor(0xf4cb42).setThumbnail(getResourceLocation());
		embed.setFooter("©R3alB0t 2017").setTimestamp(OffsetDateTime.now());
		IUser author = e.getMessage().getAuthor();
		
		embed.setAuthor(author.getUsername(), "", author.getAvatar().toString());
		long balence = 0;
		if (!db.exists(Currency.userBal(guild.getID(), author.getID()))) {
			db.incrBy(Currency.userBal(guild.getID(), author.getID()), 0);
		} else {
			balence = Long.parseLong(db.get(Currency.userBal(guild.getID(), author.getID())), 10);
		}
		embed.addField("Current Balance", "¥" + balence);
		e.getChannel().sendEmbed(embed);
	}
	
	public Resource getResourceLocation() {
		return new Resource("r3alb0t", "texture/command/Currency.png");
	}
	
}
