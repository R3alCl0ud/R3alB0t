package xyz.r3alb0t.r3alb0t.music;

import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.message.IMessage;

/**
 * @author Perry Berman
 */
public class CommandSelect extends Command {

	public CommandSelect() {
		setUnlocalizedName("select");
		setDescription("adds a track/set to the playlist\nCurrently only works with YouTube");
		setArgsRegex("(\\d+?)");
	}

	@Override
	public void execute(MessageCreateEvent e, String[] args) {
		IMessage message = e.getMessage();
		IGuild guild = message.getGuild();
		if (args.length >= 1 && guild != null && RBMusic.plManagers.containsKey(guild.getID()) && RBMusic.searchResults.containsKey(guild.getID())) {
			AudioPlaylist playlist = RBMusic.searchResults.get(guild.getID());
			int selection = Integer.parseInt(args[0], 10);
			if (selection > 0 && selection <= playlist.getTracks().size()) {
				RBMusic.plManagers.get(guild.getID()).trackLoaded(playlist.getTracks().get(selection - 1));
				RBMusic.searchResults.remove(guild.getID());
			}
		}
	}

}
