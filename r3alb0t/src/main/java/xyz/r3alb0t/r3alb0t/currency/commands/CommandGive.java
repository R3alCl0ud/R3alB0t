package xyz.r3alb0t.r3alb0t.currency.commands;

import java.time.OffsetDateTime;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.channel.IGuildTextChannel;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.guild.IGuildMember;
import io.discloader.discloader.entity.message.IMentions;
import io.discloader.discloader.entity.user.IUser;
import io.discloader.discloader.entity.util.Permissions;
import io.discloader.discloader.entity.util.SnowflakeUtil;
import io.discloader.discloader.util.DLUtil;
import redis.clients.jedis.Jedis;
import xyz.r3alb0t.r3alb0t.currency.AccountJSON;
import xyz.r3alb0t.r3alb0t.currency.Currency;
import xyz.r3alb0t.r3alb0t.util.DataBase;

public class CommandGive extends Command {

	private static Jedis db = DataBase.getClient();

	public CommandGive() {
		super();
		setUnlocalizedName("give");
		setUsage("currency give <@user> <amount>");
		setArgsRegex("<@!?(\\d+)> -?(\\d+)");
	}

	public void execute(MessageCreateEvent e, String[] args) {
		IGuild guild = e.getMessage().getGuild();
		if (guild == null) return;
		IMentions mentions = e.getMessage().getMentions();
		if (args.length < 2 || mentions.getUsers().size() > 1) {
			e.getChannel().sendMessage(getUsage());
		} else if (!Currency.getGuilds().contains(guild.getID())) {

		} else if (mentions.getUsers().size() == 1) {
			try {
				IUser mentioned = mentions.getUsers().get(0);
				AccountJSON account = null;
				if (!db.exists(Currency.userBal(guild.getID(), mentioned.getID()))) {
					account = new AccountJSON(mentioned);
				} else {
					account = DLUtil.gson.fromJson(db.get(Currency.userBal(guild.getID(), mentioned.getID())), AccountJSON.class);
				}
				account.setBalance(account.getBalance() + SnowflakeUtil.parse(args[1]));
				db.set(Currency.userBal(guild.getID(), mentioned.getID()), account.toString());
				RichEmbed embed = new RichEmbed("Currency").setColor(0xf4cb42).setThumbnail(getResourceLocation());
				embed.setAuthor(mentioned.getUsername(), "", mentioned.getAvatar().toString());
				embed.setDescription("Funds have been transfered");
				embed.setFooter("©R3alB0t 2017").setTimestamp(OffsetDateTime.now());
				embed.addField("Previous Balance", "¥" + (account.getBalance() - SnowflakeUtil.parse(args[1])), true);
				embed.addField("New Balance", "¥" + account.getBalance(), true);
				embed.addField("Amount Given", "¥" + SnowflakeUtil.parse(args[1]));
				e.getChannel().sendEmbed(embed);
			} catch (NumberFormatException e1) {
				e.getChannel().sendMessage("Error encountered while attempting to give a user credits:\n**" + e1.getClass().toString().substring(6) + "**: " + e1.getMessage());
			}
		}
	}

	@Override
	public Resource getResourceLocation() {
		return new Resource("r3alb0t", "texture/command/Currency.png");
	}

	@Override
	public boolean shouldExecute(IGuildMember member, IGuildTextChannel channel) {
		System.out.println(member.getRoles().get(0).getName());
		return member.getGuild().isOwner(member) || member.getPermissions().hasPermission(Permissions.ADMINISTRATOR) || member.getPermissions().hasPermission(Permissions.MANAGE_GUILD);
	}
}
