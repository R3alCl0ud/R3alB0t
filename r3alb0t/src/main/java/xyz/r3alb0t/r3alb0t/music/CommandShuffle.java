package xyz.r3alb0t.r3alb0t.music;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.message.IMessage;

/**
 * @author Perry Berman
 *
 */
public class CommandShuffle extends Command {
	public CommandShuffle() {
		setUnlocalizedName("shuffle").setDescription("Shuffles the playlist");
	}
	
	@Override
	public void execute(MessageCreateEvent e, String[] args) {
		IMessage message = e.getMessage();
		IGuild guild = message.getGuild();
		if (guild != null && RBMusic.plManagers.containsKey(guild.getID())) {
			PlaylistManager plm = RBMusic.plManagers.get(guild.getID());
			plm.shuffle();
			RichEmbed embed = new RichEmbed("Music Player").setColor(0x55cdF2);
			embed.addField("Shuffling", "Playlist has been shuffled");
			message.getChannel().sendEmbed(embed);
		}
	}
}
