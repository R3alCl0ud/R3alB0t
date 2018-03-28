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
		setDescription("Displays information about you");
	}
	
	@Override
	public void execute(MessageCreateEvent e) {
		IUser author = e.getMessage().getAuthor();
		RichEmbed embed = new RichEmbed("User Info");
		embed.setThumbnail(author.getAvatar().toString());
		embed.addField("Username", author, true).addField("User ID", author.getID(), true);
		embed.addField("Avatar Hash", author.getAvatar().getHash(), true);
		IGuildMember member = e.getMessage().getMember();
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
		}
		embed.addField("Account Created On", ZonedDateTime.from(author.createdAt()).format(DateTimeFormatter.ofPattern("d MMM uuuu 'at' h:mma ZZZZ", Locale.US)), true);
		embed.setTimestamp();
		e.getChannel().sendEmbed(embed);
	}
	
}
