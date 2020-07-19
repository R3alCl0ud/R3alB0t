package xyz.r3alb0t.r3alb0t.custom;

import java.util.List;
import java.util.Map;

import io.discloader.discloader.client.command.CommandHandler;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.message.GuildMessageCreateEvent;
import io.discloader.discloader.entity.IMentionable;

/**
 * @author Perry Berman
 *
 */
public class CommandEvents extends EventListenerAdapter {

    @Override
    public void GuildMessageCreate(GuildMessageCreateEvent e) {
        String content = e.getMessage().getContent();
        if (!content.startsWith(CommandHandler.prefix) || e.getMessage().getAuthor().isBot()) return;
        Map<String, CommandJSON> cmds = CustomCommands.getCommands(e.getGuild());
        String label = content.substring(CommandHandler.prefix.length()).split(" ")[0];
        if (cmds.containsKey(label)) {
            String msg = cmds.get(label).message, mentioned = "";
            msg = msg.replace("{author}", e.getMessage().getAuthor().getUsername());
            msg = msg.replace("{@author}", e.getMessage().getAuthor().toMention());
            if (msg.contains("{mentioned}")) {
                List<IMentionable> mentions = e.getMessage().getMentions().toList();
                if (mentions.size() > 0) {
                    for (int i = 0; i < mentions.size(); i++) {
                        if (i != 0) {
                            mentioned += ", ";
                        }
                        mentioned += mentions.get(i).toString();
                    }

                }
                msg = msg.replace("{mentioned}", mentioned);
            } else if (msg.contains("{@mentioned}")) {
                List<IMentionable> mentions = e.getMessage().getMentions().toList();
                if (mentions.size() > 0) {
                    for (int i = 0; i < mentions.size(); i++) {
                        if (i != 0) {
                            mentioned += ", ";
                        }
                        mentioned += mentions.get(i).toMention();
                    }
                }
                msg = msg.replace("{@mentioned}", mentioned);
            }
            System.out.println();
            e.getChannel().sendMessage(msg);
        }
    }

}
