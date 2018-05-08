package xyz.r3alb0t.r3alb0t.role.commands;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.channel.IGuildTextChannel;
import io.discloader.discloader.entity.guild.IGuildMember;
import io.discloader.discloader.entity.util.Permissions;
import xyz.r3alb0t.r3alb0t.role.Roles;

public class CommandClear extends Command {
	public CommandClear() {
		super();
		setUnlocalizedName("clear");
		setUsage("roles clear <default|level#>");
		setArgsRegex("(default|\\d+)");
	}

	@Override
	public void execute(MessageCreateEvent e, String[] args) {
		if (e.getMessage().getGuild() == null || args.length != 1) {
			e.getChannel().sendMessage(getUsage());
			return;
		}
		long level = 1;
		if (!args[0].equalsIgnoreCase("default")) {
			level = Long.parseUnsignedLong(args[0], 10);
		}
		Roles.delRank(e.getMessage().getGuild(), level);
		e.getChannel().sendMessage((level == 1 ? "The **Default**" : "**Level #" + level + "**") + "  has been cleared");
	}

	@Override
	public boolean shouldExecute(IGuildMember member, IGuildTextChannel channel) {
		return member.getPermissions().hasAny(Permissions.ADMINISTRATOR, Permissions.MANAGE_GUILD, Permissions.MANAGE_ROLES);
	}

}
