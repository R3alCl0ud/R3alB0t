package xyz.r3alb0t.r3alb0t.custom;

import java.util.Map;

import io.discloader.discloader.client.command.CommandHandler;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.message.GuildMessageCreateEvent;

/**
 * @author Perry Berman
 *
 */
public class CommandEvents extends EventListenerAdapter {
	
	public void GuildMessageCreate(GuildMessageCreateEvent e) {
		String content = e.getMessage().getContent();
		if (!content.startsWith(CommandHandler.prefix) || e.getMessage().getAuthor().isBot()) return;
		Map<String, CommandJSON> cmds = CustomCommands.getCommands(e.getGuild());
		if (cmds.containsKey(content.substring(2))) {
			e.getChannel().sendMessage(cmds.get(content.substring(2)).message);
		}
	}
	
}
