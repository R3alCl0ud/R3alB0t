package xyz.r3alb0t.r3alb0t.roles.commands;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.channel.IGuildTextChannel;
import io.discloader.discloader.entity.guild.IGuildMember;
import io.discloader.discloader.entity.guild.IRole;
import io.discloader.discloader.entity.util.Permissions;
import xyz.r3alb0t.r3alb0t.roles.Roles;

public class CommandSet extends Command {

	final String regex = "[^\\d+]*(default|\\d+)\\ +(<@\\d+>|.+)|(enabled)\\ +(y|n|Y|N)";

	public CommandSet() {
		super();
		setUnlocalizedName("set");
		setDescription("Sets config options for ranks.");
		setArgsRegex(regex);
		setUsage("roles set {<default||level#> <Role>} || {<enabled> yes||no}");
	}

	public void execute(MessageCreateEvent e, String[] args) {
		if (e.getMessage().getGuild() == null || args.length != 4) {
			if (e.getMessage().getContent().split(" ")[e.getMessage().getContent().split(" ").length - 1].equalsIgnoreCase("default")) {
				e.getChannel().sendMessage("Setting the **Default** role makes it so that users who join the server are automatically given the **Default** role");
			} else {
				e.getChannel().sendMessage(getUsage());
			}
			return;
		}

		if (args[0] != null && args[1] != null) {
			long level = 1;
			if (!args[0].equals("default")) {
				level = Long.parseUnsignedLong(args[0].trim());
			}
			IRole role = null;
			if (!e.getMessage().getMentions().getRoles().isEmpty()) {
				role = e.getMessage().getMentions().getRoles().get(0);
			} else {
				try {
					role = e.getMessage().getGuild().getRoleByID(args[1].trim());
				} catch (Exception ignored) {}
			}
			if (role == null) {
				role = e.getMessage().getGuild().getRoleByName(args[1].trim());
			}
			if (role == null) {
				e.getChannel().sendMessage("Unknown Role: `" + args[1].trim() + "`");
				return;
			}
			Roles.setRank(role, level);
			e.getChannel().sendMessage((level == 1 ? "The **Default**" : "**Level #" + level + "'s**") + " role has been set to `" + role.getName() + "`");
		} else if (args[2] != null && args[3] != null) {
			boolean enabled = args[3].equalsIgnoreCase("y");
			Roles.setGuildEnabled(e.getMessage().getGuild(), enabled);
			e.getChannel().sendMessage("Leveling System has been `" + (enabled ? "en" : "dis") + "abled`");
		} else {
			e.getChannel().sendMessage(getUsage());
		}
	}

	@Override
	public boolean shouldExecute(IGuildMember member, IGuildTextChannel channel) {
		return member.getPermissions().hasAny(Permissions.ADMINISTRATOR, Permissions.MANAGE_GUILD, Permissions.MANAGE_ROLES);
	}
}
