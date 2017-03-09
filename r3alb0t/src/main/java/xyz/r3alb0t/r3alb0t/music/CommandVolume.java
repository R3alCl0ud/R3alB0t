package xyz.r3alb0t.r3alb0t.music;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.MessageCreateEvent;
import io.discloader.discloader.entity.message.Message;

/**
 * @author Perry Berman
 *
 */
public class CommandVolume extends Command {
    public CommandVolume() {
        setUnlocalizedName("volume");
    }

    public void execute(MessageCreateEvent e) {
        Message message = e.message;

        if (message.guild != null && e.loader.voiceConnections.containsKey(message.guild.id)) {
            e.loader.voiceConnections.get(message.guild.id).player.setVolume(10);
        }
    }
}
