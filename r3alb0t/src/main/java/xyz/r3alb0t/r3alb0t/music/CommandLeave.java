package xyz.r3alb0t.r3alb0t.music;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.voice.VoiceConnection;

/**
 * @author Perry Berman
 *
 */
public class CommandLeave extends Command {
    public CommandLeave() {
        setTextureName("r3alb0t:eject");
        setUnlocalizedName("leave");
    }

    @Override
	public void execute(MessageCreateEvent e) {
		IGuild guild = e.getMessage().getGuild();
        if (guild != null) {
			VoiceConnection connection = e.loader.voiceConnections.get(guild.getID());
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

}
