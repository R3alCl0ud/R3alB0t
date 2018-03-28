package xyz.r3alb0t.r3alb0t.custom.commands;

import java.util.HashMap;
import java.util.Map;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.command.CommandTree;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.channel.IGuildTextChannel;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.guild.IGuildMember;
import io.discloader.discloader.entity.message.MessageBuilder;
import io.discloader.discloader.entity.util.Permissions;
import xyz.r3alb0t.r3alb0t.custom.CommandJSON;
import xyz.r3alb0t.r3alb0t.custom.CustomCommands;

/**
 * @author Perry Berman
 */
public class CommandCommands extends CommandTree {
	
	private Map<String, Command> subs;
	private static Command list;
	private static Command create;
	
	public CommandCommands() {
		super("commands");
		subs = new HashMap<>();
		subs.put((list = new CommandList()).getUnlocalizedName(), list);
		subs.put((create = new CommandCreate()).getUnlocalizedName(), create);
	}
	
	public Map<String, Command> getSubCommands() {
		return subs;
	}
	
	public class CommandCreate extends Command {
		
		public CommandCreate() {
			super();
			setUnlocalizedName("create");
			setArgsRegex("([^:]+?):(.*+)");
			setDescription("Creates a new custom command for this server.");
			setFullDescription(getDescription() + "\nThe `Manage Server` permission is required to create a new command");
			setUsage("commands create <name:message>");
		}
		
		public void execute(MessageCreateEvent e, String[] args) {
			IGuild guild = e.getMessage().getGuild();
			if ((guild == null) || (args == null || args.length < 2 || args.length > 2)) {
				MessageBuilder builder = new MessageBuilder(e.getChannel());
				builder.appendFormat("Usage: `%s`", getUsage()).newLine().newLine();
				builder.append("Message Templating Options:").newLine().newLine();
				builder.append("The String `{author}` will be replaced with the username of the user who runs the command").newLine();
				builder.append("The String `{@author}` will mention the user who runs the command").newLine();
				builder.append("The String `{mentioned}` will be replaced with the name of the user or role mentioned when running the command").newLine();
				builder.append("The String `{@mentioned}` will mention the user or role mentioned when running the command").newLine();
				builder.sendMessage();
				return;
			}
			CustomCommands.setCommand(guild, args[0], args[1]);
			RichEmbed embed = new RichEmbed("Command Created/Edited").setColor(0xFF00);
			embed.addField("Command Name", args[0], true).addField("Command Response", args[1], true);
			e.getChannel().sendEmbed(embed);
		}
		
		@Override
		public boolean shouldExecute(IGuildMember member, IGuildTextChannel channel) {
			boolean can = member.getPermissions().hasAny(Permissions.ADMINISTRATOR, Permissions.MANAGE_GUILD) || member.isOwner();
			if (!can)
				channel.sendMessage("**Error:** The `Administrator` or the `Manage Server` permissions are required to modify this server's custom commands.");
			return can;
		}
	}
	
	public class CommandList extends Command {
		
		public CommandList() {
			super();
			setUnlocalizedName("list");
			setDescription("Lists the server's custom commands");
		}
		
		public void execute(MessageCreateEvent e, String[] args) {
			IGuild guild = e.getMessage().getGuild();
			if (guild == null)
				return;
			Map<String, CommandJSON> cmds = CustomCommands.getCommands(guild);
			String content = "Custom Commands:\n\n";
			for (CommandJSON cmd : cmds.values()) {
				content += ("`" + cmd.title + "`\n");
			}
			e.getChannel().sendMessage(content);
		}
	}
	
}
