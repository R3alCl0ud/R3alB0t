package xyz.r3alb0t.r3alb0t.music;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.common.registry.EntityRegistry;
import io.discloader.discloader.entity.channel.ITextChannel;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.message.IMessage;

public class CommandPlay extends Command {

	public CommandPlay() {
		setUnlocalizedName("play");
		setDescription("adds a track/set to the playlist\nCurrently only works with YouTube");
	}

	public Resource getResourceLocation() {
		return new Resource("r3alb0t", "texture/command/Play.png");
	}

	@Override
	public void execute(MessageCreateEvent e, String[] args) {
		IMessage message = e.getMessage();
		IGuild guild = message.getGuild();
		ITextChannel channel = message.getChannel();
		if (guild != null && RBMusic.plManagers.containsKey(guild.getID())) {
			PlaylistManager plManager = RBMusic.plManagers.get(guild.getID());
			if (args.length > 0) {
				String trackID = args[0];
				if (!trackID.startsWith("http")) trackID = "ytsearch:" + trackID;
				EntityRegistry.getVoiceConnectionByGuild(guild).findTrackOrTracks(trackID, plManager);
				// new AudioLoadResultHandler() {
				//
				// @Override
				// public void trackLoaded(AudioTrack track) {
				// System.out.println(track);
				// plManager.trackLoaded(track);
				// }
				//
				// @Override
				// public void playlistLoaded(AudioPlaylist playlist) {
				// plManager.playlistLoaded(playlist);
				// }
				//
				// @Override
				// public void noMatches() {
				// channel.sendMessage(String.format("No audio found at: %s",
				// args[0]));
				// }
				//
				// @Override
				// public void loadFailed(FriendlyException exception) {
				// String err = exception.toString();
				// StackTraceElement[] trace = exception.getStackTrace();
				// for (StackTraceElement traceElement : trace) {
				// err += ("\tat " + traceElement);
				// }
				// channel.sendMessage(err);
				// }
				//
				// };
			} else {
				plManager.startNext();
			}
		}
	}
}
