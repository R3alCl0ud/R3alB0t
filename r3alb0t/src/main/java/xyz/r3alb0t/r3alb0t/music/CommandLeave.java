package xyz.r3alb0t.r3alb0t.music;

import java.time.OffsetDateTime;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.channel.ITextChannel;
import io.discloader.discloader.entity.guild.IGuild;

/**
 * @author Perry Berman
 */
public class CommandLeave extends Command {

	public CommandLeave() {
		setTextureName("r3alb0t:eject");
		setUnlocalizedName("leave");
	}

	public Resource getResourceLocation() {
		return new Resource("r3alb0t", "texture/command/Eject.png");
	}

	@Override
	public void execute(MessageCreateEvent e) {
		IGuild guild = e.getMessage().getGuild();
		ITextChannel channel = e.getMessage().getChannel();
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x55cdF2);
		embed.setThumbnail(getResourceLocation());
		embed.setFooter("R3alB0t 2017").setTimestamp(OffsetDateTime.now());
		if (guild != null && guild.getVoiceConnection() != null) {
			guild.getVoiceConnection().disconnect().thenAcceptAsync(vc -> {
				embed.addField("Joined Voice", String.format("Joined the VoiceChannel *%s*", vc.getChannel().getName()));
				RBMusic.plManagers.remove(guild.getID());
			});
		} else {
			embed.addField("Error", "Either you are not in a guild, or voice channel, or I am not connected to a voice channel in this guild");
		}
		channel.sendEmbed(embed);
	}

}
