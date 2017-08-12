package xyz.r3alb0t.r3alb0t.currency.commands;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.command.CommandHandler;
import io.discloader.discloader.client.command.CommandTree;
import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.channel.IGuildTextChannel;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.guild.IGuildMember;
import io.discloader.discloader.entity.guild.IRole;
import io.discloader.discloader.entity.user.IUser;
import io.discloader.discloader.entity.util.Permissions;
import io.discloader.discloader.entity.util.SnowflakeUtil;
import io.discloader.discloader.util.DLUtil;
import redis.clients.jedis.Jedis;
import xyz.r3alb0t.r3alb0t.currency.Currency;
import xyz.r3alb0t.r3alb0t.currency.RewardJSON;
import xyz.r3alb0t.r3alb0t.util.DataBase;

/**
 * @author Perry Berman
 *
 */
public class CommandRewards extends CommandTree {
	
	private static Jedis db = DataBase.getDataBase();
	
	private Map<String, Command> subs;
	
	private static Command create;
	private static Command list;
	private static Command buy;
	
	/**
	 * @param unlocalizedName
	 */
	public CommandRewards(String unlocalizedName) {
		super(unlocalizedName);
		setDescription("Base command for managing rewards.");
		subs = new HashMap<>();
		subs.put((create = new CreateRewards()).getUnlocalizedName(), create);
		subs.put((list = new ListRewards()).getUnlocalizedName(), list);
		subs.put((buy = new BuyReward()).getUnlocalizedName(), buy);
	}
	
	@Override
	public Map<String, Command> getSubCommands() {
		return subs;
	}
	
	@Override
	public Resource getResourceLocation() {
		return new Resource("r3alb0t", "texture/command/Currency.png");
	}
	
	public class ListRewards extends Command {
		public ListRewards() {
			super();
			setUnlocalizedName("list");
			setDescription("Lists server's available rewards.");
			setArgsRegex("(\\d+)");
		}
		
		public void execute(MessageCreateEvent e, String[] args) {
			IGuild guild = e.getMessage().getGuild();
			if (guild == null) return;
			IGuildMember member = e.getMessage().getMember();
			List<IRole> roles = member.getRoles();
			Set<String> rs = db.smembers(Currency.rewards(guild.getID()));
			if (rs.isEmpty()) return;
			int page = 1;
			if (args.length == 1) {
				page = Integer.parseInt(args[0]);
			}
			Map<String, RewardJSON> rwsj = new HashMap<>();
			List<RewardJSON> rewards = new ArrayList<>();
			for (String r : rs) {
				RewardJSON rj = DLUtil.gson.fromJson(db.get(Currency.reward(guild.getID(), r)), RewardJSON.class);
				rewards.add(rj);
				rwsj.put(rj.name, rj);
			}
			rewards.sort((a, b) -> {
				System.out.println(DLUtil.gson.toJson(a));
				System.out.println(DLUtil.gson.toJson(b));
				if (a.id.equals(b.required) || (a.required != null && a.required.equals(b.required) && a.price > b.price) || (a.required == null && b.required == null && a.price > b.price)) return 1;
				if (b.id.equals(a.required) || (a.required != null && a.required.equals(b.required) && a.price < b.price) || (a.required == null && b.required == null && a.price < b.price)) return -1;
				if (a.price == b.price) {
					if (a.name.compareTo(b.name) > 0) return 1;
					if (a.name.compareTo(b.name) < 0) return -1;
				}
				return 0;
			});
			RichEmbed embed = new RichEmbed("Rewards").setColor(0xf4a742);// .setColor(color)
			embed.setThumbnail(CommandRewards.this.getResourceLocation());
			embed.setFooter("©R3alB0t 2017").setTimestamp(OffsetDateTime.now());
			for (int i = 0 + (5 * (page - 1)); i < rewards.size(); i++) {
				RewardJSON rj = rewards.get(i);
				String text = String.format("**ID**: %s\n**Price**: ¥%d\n**Requires**: %s\n**Purchased**: %b", rj.id, rj.price, rj.required == null ? "none" : rwsj.get(rj.required).name, roles.contains(guild.getRoleByID(rj.id)));
				embed.addField(rj.name, text);
			}
			e.getChannel().sendEmbed(embed);
		}
	}
	
	public class BuyReward extends Command {
		public BuyReward() {
			super();
			setUnlocalizedName("buy");
			setDescription("This command is used to purchase rewards on this server.");
			setArgsRegex("(.*)");
		}
		
		public void execute(MessageCreateEvent e, String[] args) {
			IGuild guild = e.getMessage().getGuild();
			if (guild == null) return;
			if (args.length == 0 || args[0] == null) {
				e.getChannel().sendMessage("To purchase a reward run `" + CommandHandler.prefix + "rewards buy <reward>`\nA list of rewards can be found by running `" + CommandHandler.prefix + "rewards list`");
				return;
			}
			args[0] = args[0].trim();
			if (!db.sismember(Currency.rewards(guild.getID()), args[0].toLowerCase())) {
				e.getChannel().sendMessage("Error: Unknown reward \"" + args[0] + "\"");
				return;
			}
			IUser author = e.getMessage().getAuthor();
			IGuildMember member = e.getMessage().getMember();
			RewardJSON rj = DLUtil.gson.fromJson(db.get(Currency.reward(guild.getID(), args[0].toLowerCase())), RewardJSON.class);
			String b = db.get(Currency.userBal(guild.getID(), member.getID()));
			long balance = Long.parseLong(b == null ? "0" : b, 10);
			IRole role = guild.getRoleByID(rj.id);
			if (balance < rj.price) {
				e.getChannel().sendMessage("Error: Insufficient funds");
				return;
			} else if (member.getRoles().contains(role)) {
				e.getChannel().sendMessage("Error: Reward already purchased");
				return;
			} else if (rj.required != null && !member.getRoles().contains(guild.getRoleByName(rj.required))) {
				e.getChannel().sendMessage("Error: The role *" + guild.getRoleByID(rj.required).getName() + "* is required to purchase this reward");
				return;
			}
			member.giveRole(role).thenAccept(a -> {
				if (rj.required != null) {
					a.takeRole(guild.getRoleByName(rj.required)).thenAccept(c -> {
						db.decrBy(Currency.userBal(guild.getID(), member.getID()), rj.price);
						RichEmbed embed = new RichEmbed("Purchase Receipt").setColor(0xf4a742);
						embed.setAuthor(author.getUsername(), "", author.getAvatar().toString());
						embed.addField("Item", String.format("**Name:** %s\n**ID:** %d\n**Price:** %d\n**Quantity:** x1", role.getName(), role.getID(), rj.price), true);
						embed.addField("Total Payed", "¥" + rj.price, true).addField("Remaining Balance", "¥" + (balance - rj.price), true);
						embed.setFooter("©R3alB0t 2017").setTimestamp(OffsetDateTime.now());
						embed.setThumbnail(CommandRewards.this.getResourceLocation());
						e.getChannel().sendEmbed(embed);
					});
				} else {
					db.decrBy(Currency.userBal(guild.getID(), member.getID()), rj.price);
					RichEmbed embed = new RichEmbed("Purchase Receipt").setColor(0xf4a742);
					embed.setAuthor(author.getUsername(), "", author.getAvatar().toString());
					embed.addField("Item", String.format("**Name:** %s\n**ID:** %d\n**Price:** %d\n**Quantity:** x1", role.getName(), role.getID(), rj.price), true);
					embed.addField("Total Payed", "¥" + rj.price, true).addField("Remaining Balance", "¥" + (balance - rj.price), true);
					embed.setFooter("©R3alB0t 2017").setTimestamp(OffsetDateTime.now());
					embed.setThumbnail(CommandRewards.this.getResourceLocation());
					e.getChannel().sendEmbed(embed);
					author.sendEmbed(embed);
				}
			});
		}
		
		@Override
		public boolean shouldExecute(IGuildMember member, IGuildTextChannel channel) {
			return true;
		}
	}
	
	public class CreateRewards extends Command {
		public CreateRewards() {
			super();
			setUnlocalizedName("create");
			setUsage("create <role>:<price>[:requiredRole]");
			setDescription("Creates rewards that can be purchased using credits obtained from chatting.");
			setArgsRegex("([^:]+):-?(\\d+)(?>:([^:]+))?");
		}
		
		public void execute(MessageCreateEvent e, String[] args) {
			IGuild guild = e.getMessage().getGuild();
			if (guild == null) return;
			if (args.length < 2) {
				e.getChannel().sendMessage("Usage: " + getUsage());
				return;
			}
			IRole role = guild.getRoleByName(args[0]) == null ? guild.getRoleByID(args[0]) : guild.getRoleByName(args[0]), required = null;
			long price = Long.parseLong(args[1], 10);
			if (role == null) {
				e.getChannel().sendMessage("Error: unknown role");
				return;
			}
			
			RewardJSON reward = new RewardJSON();
			reward.id = SnowflakeUtil.asString(role);
			reward.price = price;
			reward.name = role.getName();
			if (args.length == 3 && args[2] != null && ((required = guild.getRoleByName(args[2].trim())) != null || (required = guild.getRoleByID(args[2].trim())) != null)
					&& db.exists(Currency.reward(guild.getID(), required.getName().toLowerCase()))) {
				reward.required = required.getName();
			}
			db.set(Currency.reward(guild.getID(), role.getName().toLowerCase()), DLUtil.gson.toJson(reward));
			db.sadd(Currency.rewards(guild.getID()), role.getName().toLowerCase());
			RichEmbed embed = new RichEmbed("Rewards").setColor(0xf4a742);
			embed.setFooter("©R3alB0t 2017").setTimestamp(OffsetDateTime.now());
			embed.setThumbnail(CommandRewards.this.getResourceLocation());
			embed.setDescription("New reward created");
			embed.addField("Name", role.getName(), true).addField("Price", "¥" + reward.price, true);
			if (reward.required != null) embed.addField("Requires", required.getName(), true);
			e.getChannel().sendEmbed(embed);
		}
		
		@Override
		public boolean shouldExecute(IGuildMember member, IGuildTextChannel channel) {
			return member.getGuild().isOwner(member) || member.getPermissions().hasPermission(Permissions.ADMINISTRATOR) || member.getPermissions().hasPermission(Permissions.MANAGE_GUILD);
		}
	}
	
}
