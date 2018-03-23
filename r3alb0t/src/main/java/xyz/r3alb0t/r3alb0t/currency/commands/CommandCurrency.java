package xyz.r3alb0t.r3alb0t.currency.commands;

import java.util.HashMap;
import java.util.Map;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.command.CommandTree;
import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.channel.IGuildTextChannel;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.guild.IGuildMember;
import io.discloader.discloader.entity.util.Permissions;
import redis.clients.jedis.Jedis;
import xyz.r3alb0t.r3alb0t.currency.Currency;
import xyz.r3alb0t.r3alb0t.util.DataBase;

/**
 * @author Perry Berman
 */
public class CommandCurrency extends CommandTree {

	public static class CommandSet extends CommandTree {

		public class CommandCoolDown extends Command {

			public CommandCoolDown() {
				super();
				setUnlocalizedName("cooldown");
				setArgsRegex("(\\d+)");
				setUsage("currency set cooldown <TimeInSeconds>");
				setDescription("Sets the cooldown for the payout");
			}

			public void execute(MessageCreateEvent e, String[] args) {
				IGuild guild = e.getMessage().getGuild();
				if (guild == null) {
					e.getChannel().sendMessage(getUsage());
				} else if (args.length == 0) {
					Jedis db = DataBase.getClient();
					String s = db.get(Currency.coolDown(guild.getID()));
					if (s == null) {
						db.set(Currency.coolDown(guild.getID()), "120");
					}
					int cooldown = Integer.parseInt(s == null ? "120" : s, 10);
					e.getChannel().sendMessage("The Payout Cooldown is `" + cooldown + "(seconds)`");
				} else {
					Jedis db = DataBase.getClient();
					db.set(Currency.coolDown(guild.getID()), args[0]);
					e.getChannel().sendMessage("The Payout Cooldown has been set to `" + args[0] + "(seconds)`");
				}
			}

			public boolean shouldExecute(IGuildMember member, IGuildTextChannel channel) {
				return member.getPermissions().hasAny(Permissions.MANAGE_GUILD, Permissions.ADMINISTRATOR);
			}
		}

		public class CommandInterest extends Command {

			public CommandInterest() {
				super();
				setUnlocalizedName("payout");
				setUsage("currency set payout <number>");
				setArgsRegex("(\\d+)");
			}

			public void execute(MessageCreateEvent e, String[] args) {
				IGuild guild = e.getMessage().getGuild();
				if (guild == null) {
					e.getChannel().sendMessage(getUsage());
				} else if (args.length == 0) {
					Jedis db = DataBase.getClient();
					String s = db.get(Currency.interest(guild.getID()));
					if (s == null) {
						db.set(Currency.interest(guild.getID()), "10");
					}
					int cooldown = s == null ? 10 : Integer.parseInt(s, 10);
					e.getChannel().sendMessage("The Payout is `¥" + cooldown + "`");
				} else {
					Jedis db = DataBase.getClient();
					db.set(Currency.interest(guild.getID()), args[0]);
					e.getChannel().sendMessage("The Payout has been set to `¥" + args[0] + "`");
				}
			}

			public boolean shouldExecute(IGuildMember member, IGuildTextChannel channel) {
				return member.getPermissions().hasAny(Permissions.MANAGE_GUILD, Permissions.ADMINISTRATOR);
			}
		}

		public class CommandUseXP extends Command {
			public CommandUseXP() {
				super();
				setUnlocalizedName("usexp");
				setDescription("Use XP instead of credits");
				setArgsRegex("(yes|no)");
				setUsage("usexp [yes/no]");
			}
		}

		private Map<String, Command> subs;

		private Command coolDown;
		private Command interest;

		public CommandSet() {
			super("set");
			setUsage("currency set <property>");
			subs = new HashMap<>();
			subs.put((coolDown = new CommandCoolDown()).getUnlocalizedName(), coolDown);
			subs.put((interest = new CommandInterest()).getUnlocalizedName(), interest);
		}

		public Map<String, Command> getSubCommands() {
			return subs;
		}
	}

	private static Command enable;
	private static Command disable;
	private static Command give;
	private static Command set;

	private Map<String, Command> subs;

	/**
	 * 
	 */
	public CommandCurrency() {
		super("currency");
		setDescription("Base command for managing currency.");
		setFullDescription("Base command for managing currency.\nBy enabling currency you **__explicitly__** authorize <@132347121520214016> to store *EndUserData(EUD)* such as *Usernames/Nicknames/names* of the members/roles/channels of this guild.");
		subs = new HashMap<>();
		enable = new CommandEnable();
		disable = new CommandDisable();
		give = new CommandGive();
		set = new CommandSet();
		subs.put(enable.getUnlocalizedName(), enable);
		subs.put(disable.getUnlocalizedName(), disable);
		subs.put(give.getUnlocalizedName(), give);
		subs.put(set.getUnlocalizedName(), set);
	}

	@Override
	public void defaultResponse(MessageCreateEvent e) {
		System.out.println("Currency");
		// try {
		// String text = ;
		// System.out.println(text);
		e.getChannel().sendMessage("Available option(s) are: " + this.subsText(this, 0)).thenAcceptAsync(msg -> {
			System.out.println(msg.getContent());
		});
		// } catch (Exception e1) {
		// e1.printStackTrace();
		// }
	}

	public Resource getResourceLocation() {
		return new Resource("r3alb0t", "texture/command/Currency.png");
	}

	public Map<String, Command> getSubCommands() {
		return subs;
	}

}
