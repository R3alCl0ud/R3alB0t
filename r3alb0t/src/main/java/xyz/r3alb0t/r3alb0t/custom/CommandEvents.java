package xyz.r3alb0t.r3alb0t.custom;

import java.util.Map;

import io.discloader.discloader.client.command.CommandHandler;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.message.GuildMessageCreateEvent;
import io.discloader.discloader.entity.message.IMentions;

/**
 * @author Perry Berman
 *
 */
public class CommandEvents extends EventListenerAdapter {

	public void GuildMessageCreate(GuildMessageCreateEvent e) {
		String content = e.getMessage().getContent();
		if (!content.startsWith(CommandHandler.prefix) || e.getMessage().getAuthor().isBot())
			return;
		Map<String, CommandJSON> cmds = CustomCommands.getCommands(e.getGuild());
		String label = content.substring(CommandHandler.prefix.length()).split(" ")[0];
		if (cmds.containsKey(label)) {
			String msg = cmds.get(label).message;
			msg = msg.replace("{author}", e.getMessage().getAuthor().getUsername());
			msg = msg.replace("{@author}", e.getMessage().getAuthor().asMention());
			if (msg.contains("{mentioned}")) {
				IMentions mentions = e.getMessage().getMentions();
				if (mentions.size() > 0) {
					if (mentions.getUsers().size() > 0) {
						msg = msg.replace("{mentioned}", mentions.getUsers().get(0).getUsername());
					} else if (mentions.getRoles().size() > 0) {
						msg = msg.replace("{mentioned}", mentions.getRoles().get(0).getName());
					}
				}
			} else if (msg.contains("{@mentioned}")) {
				IMentions mentions = e.getMessage().getMentions();
				if (mentions.size() > 0) {
					if (mentions.getUsers().size() > 0) {
						msg = msg.replace("{@mentioned}", mentions.getUsers().get(0).asMention());
					} else if (mentions.getRoles().size() > 0) {
						msg = msg.replace("{@mentioned}", mentions.getRoles().get(0).asMention());
					}
				}
			}
			e.getChannel().sendMessage(msg);
		}
	}

}
