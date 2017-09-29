package xyz.r3alb0t.r3alb0t.custom.commands;

import java.util.HashMap;
import java.util.Map;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.command.CommandTree;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.guild.IGuild;
import xyz.r3alb0t.r3alb0t.R3alB0t;
import xyz.r3alb0t.r3alb0t.custom.CommandJSON;
import xyz.r3alb0t.r3alb0t.custom.CustomCommands;

/**
 * @author Perry Berman
 */
public class CommandCommands extends CommandTree {

	private Map<String, Command> subs;
	private static Command list;
	private static Command create;

	/**
	 * 
	 */
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
			setUsage("commands create <name:message>");
		}

		public void execute(MessageCreateEvent e, String[] args) {
			if (args == null || args.length < 2 || args.length > 2) {
				e.getChannel().sendMessage(getUsage());
				return;
			}
			R3alB0t.logger.info(String.format("Name: %s\nMessage: %s", args[0], args[1]));
		}
	}

	public class CommandList extends Command {

		public CommandList() {
			super();
			setUnlocalizedName("list");
		}

		public void execute(MessageCreateEvent e, String[] args) {
			IGuild guild = e.getMessage().getGuild();
			if (guild == null) return;
			Map<String, CommandJSON> cmds = CustomCommands.getCommands(guild);
			String content = "Custom Commands:\n\n";
			for (CommandJSON cmd : cmds.values()) {
				content += ("`" + cmd.title + "`\n");
			}
			e.getChannel().sendMessage(content);
		}
	}

}
