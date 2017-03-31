package xyz.r3alb0t.r3alb0t.music;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;

/**
 * @author Perry Berman
 *
 */
public class CommandPause extends Command {
    public CommandPause() {
        setUnlocalizedName("pause").setUsage("pause").setDescription("Pauses the current track(if one is playing)");
        setTextureName("r3alb0t:pause");
    }

    public void execute(MessageCreateEvent e) {

    }
}
