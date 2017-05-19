package xyz.r3alb0t.r3alb0t.music;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.common.registry.EntityRegistry;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.message.IMessage;
import io.discloader.discloader.entity.voice.VoiceConnect;

/**
 * @author Perry Berman
 */
public class CommandPause extends Command {

	public CommandPause() {
		setUnlocalizedName("pause").setUsage("pause").setDescription("Pauses the current track(if one is playing)");
		setTextureName("r3alb0t:pause");
	}

	public Resource getResourceLocation() {
		return new Resource("r3alb0t", "texture/command/Pause.png");
	}

	public void execute(MessageCreateEvent e) {
		IMessage message = e.getMessage();
		RichEmbed embed = new RichEmbed("Music Player").setColor(0xfadd38).setThumbnail(getResourceLocation());
		VoiceConnect connection = EntityRegistry.getVoiceConnectionByGuild(message.getGuild());
		if (message.getGuild() != null && connection != null) {
			
		}
		message.getChannel().sendEmbed(embed);
	}
}
