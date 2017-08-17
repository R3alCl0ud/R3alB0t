package xyz.r3alb0t.r3alb0t.currency.commands;

import java.time.OffsetDateTime;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.user.IUser;
import io.discloader.discloader.entity.util.Permissions;
import io.discloader.discloader.util.DLUtil;
import redis.clients.jedis.Jedis;
import xyz.r3alb0t.r3alb0t.currency.AccountJSON;
import xyz.r3alb0t.r3alb0t.currency.Currency;
import xyz.r3alb0t.r3alb0t.util.DataBase;

/**
 * @author Perry Berman
 */
public class CommandBalance extends Command {

	private static Jedis db = DataBase.getDataBase();

	public CommandBalance() {
		setUnlocalizedName("balance");
		setArgsRegex("<@!?(\\d+)>");
	}

	public void execute(MessageCreateEvent e, String[] args) {
		IGuild guild = e.getMessage().getGuild();
		if (guild == null) {
			e.getChannel().sendMessage("This command can only be executed in a guild");
			return;
		}
		RichEmbed embed = new RichEmbed().setColor(0xf4cb42).setThumbnail(getResourceLocation());
		embed.setFooter("©R3alB0t 2017").setTimestamp(OffsetDateTime.now());
		IUser user = e.getMessage().getAuthor();
		if (e.getMessage().getMentions().getUsers().size() > 0 && guild.getMember(user.getID()).getPermissions().hasAny(Permissions.MANAGE_GUILD)) {
			user = e.getMessage().getMentions().getUsers().get(0);
		}
		embed.setAuthor(user.toString(), "", user.getAvatar().toString());
		embed.setDescription(String.format("Showing the balance of %s", user.asMention()));
		AccountJSON account = null;
		if (!db.exists(Currency.userBal(guild.getID(), user.getID()))) {
			db.set(Currency.userBal(guild.getID(), user.getID()), (account = new AccountJSON(user)).toString());
		} else {
			account = DLUtil.gson.fromJson(db.get(Currency.userBal(guild.getID(), user.getID())), AccountJSON.class);
		}
		embed.addField("Current Balance", "¥" + account.getBalance());
		e.getChannel().sendEmbed(embed);
	}

	public Resource getResourceLocation() {
		return new Resource("r3alb0t", "texture/command/Currency.png");
	}

}
