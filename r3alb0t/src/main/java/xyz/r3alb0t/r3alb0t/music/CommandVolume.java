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
public class CommandVolume extends Command {

	public CommandVolume() {
		setUnlocalizedName("volume");
		setArgsRegex("(\\d+)");
	}

	public Resource getResourceLocation() {
		return new Resource("r3alb0t", "texture/command/Volume.png");
	}

	@Override
	public void execute(MessageCreateEvent e, String[] args) {
		IMessage message = e.getMessage();
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7).setThumbnail(getResourceLocation());
		VoiceConnect connection = EntityRegistry.getVoiceConnectionByGuild(message.getGuild());
		if (message.getGuild() != null && connection != null) {
			if (args.length > 0) {
				int volume = Integer.parseInt(args[0], 10);
				connection.setVolume(volume);
				embed.addField("Volume", String.format("Volume set to *%d*", volume) + "%");
			} else {
				embed.addField("Volume", String.format("Volume is currently *%d*", connection.getVolume()) + "%");
			}
		} else {
			embed.addField("Error", "There is no music player instance for this guild, or command was received in a private message");
		}
		message.getChannel().sendEmbed(embed);
	}
}
