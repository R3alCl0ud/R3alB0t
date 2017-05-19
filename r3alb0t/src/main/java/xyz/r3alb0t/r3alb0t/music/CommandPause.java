package xyz.r3alb0t.r3alb0t.music;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.channel.ITextChannel;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.message.IMessage;

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
		IGuild guild = message.getGuild();
		ITextChannel channel = message.getChannel();
		RichEmbed embed = new RichEmbed("Music Player").setColor(0xfadd38).setThumbnail(getResourceLocation());
		if (guild != null && RBMusic.plManagers.containsKey(guild.getID())) RBMusic.plManagers.get(guild.getID()).pause();
		channel.sendEmbed(embed);
	}
}
