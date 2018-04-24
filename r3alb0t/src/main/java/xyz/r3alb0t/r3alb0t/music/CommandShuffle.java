package xyz.r3alb0t.r3alb0t.music;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.message.IMessage;
import xyz.r3alb0t.r3alb0t.R3alB0t;

/**
 * @author Perry Berman
 */
public class CommandShuffle extends Command {

	public CommandShuffle() {
		setUnlocalizedName("shuffle").setDescription("Shuffles the playlist");
	}

	public Resource getResourceLocation() {
		return new Resource("r3alb0t", "texture/command/shuffle.png");
	}

	@Override
	public void execute(MessageCreateEvent e, String[] args) {
		IMessage message = e.getMessage();
		IGuild guild = message.getGuild();
		if (guild != null && RBMusic.plManagers.containsKey(guild.getID())) {
			PlaylistManager plm = RBMusic.plManagers.get(guild.getID());
			plm.shuffle();
			RichEmbed embed = new RichEmbed("Music Player").setColor(0x55cdF2);
			embed.setFooter(R3alB0t.getCopyrightInfo()).setTimestamp();
			embed.addField("Shuffling", "Playlist has been shuffled");
			embed.setThumbnail(getResourceLocation());
			message.getChannel().sendEmbed(embed);
		}
	}
}
