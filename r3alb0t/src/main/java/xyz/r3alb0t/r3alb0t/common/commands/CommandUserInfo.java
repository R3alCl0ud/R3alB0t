package xyz.r3alb0t.r3alb0t.common.commands;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.guild.IGuildMember;
import io.discloader.discloader.entity.user.IUser;

/**
 * @author Perry Berman
 *
 */
public class CommandUserInfo extends Command {

	/**
	 * 
	 */
	public CommandUserInfo() {
		super();
		setUnlocalizedName("userinfo");
		setDescription("Displays information about you or the mentioned user.");
		setUsage("userinfo [@user]");
	}

	@Override
	public void execute(MessageCreateEvent e) {
		IUser user = e.getMessage().getAuthor();
		if (!e.getMessage().getMentions().getUsers().isEmpty()) {
			user = e.getMessage().getMentions().getUsers().get(0);
		}
		RichEmbed embed = new RichEmbed("User Info");
		embed.setDescription("Displaying the user's current properties");
		embed.setThumbnail(user.getAvatar().toString());
		embed.addField("Username", user, true).addField("User ID", user.getID(), true);
		embed.addField("Avatar Hash", user.getAvatar().getHash(), true);
		IGuildMember member = e.getMessage().getGuild() == null ? null : e.getMessage().getGuild().getMember(user.getID());
		if (member != null) {
			embed.addField("Nickname", member.getNickname(), true);
			String roles = "";
			for (int i = 0; i < member.getRoles().size(); i++) {
				roles += member.getRoles().get(i).getName();
				if (i < member.getRoles().size() - 1) {
					roles += ", ";
				}
			}
			embed.addField("Roles", roles, true);
			embed.addField("Joined Server On", ZonedDateTime.from(member.getJoinTime()).format(DateTimeFormatter.ofPattern("d MMM uuuu 'at' h:mma ZZZZ", Locale.US)), true);
			if (member.getHighestRole() != null)
				embed.setColor(member.getHighestRole().getColor());
		}
		embed.addField("Account Created On", ZonedDateTime.from(user.createdAt()).format(DateTimeFormatter.ofPattern("d MMM uuuu 'at' h:mma ZZZZ", Locale.US)), true);
		embed.setTimestamp();
		e.getChannel().sendEmbed(embed);
	}

}
