package xyz.r3alb0t.r3alb0t.music;

import com.sedmelluq.discord.lavaplayer.player.AudioLoadResultHandler;
import com.sedmelluq.discord.lavaplayer.tools.FriendlyException;
import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist;
import com.sedmelluq.discord.lavaplayer.track.AudioTrack;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackInfo;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.common.registry.EntityRegistry;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.channel.ITextChannel;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.message.IMessage;

public class CommandPlay extends Command {
	
	public CommandPlay() {
		setUnlocalizedName("play");
		setDescription("adds a track/set to the playlist\n");
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
				EntityRegistry.getVoiceConnectionByGuild(guild).findTrackOrTracks(trackID, new AudioLoadResultHandler() {
					
					@Override
					public void trackLoaded(AudioTrack track) {
						System.out.println(track);
						plManager.trackLoaded(track);
					}
					
					@Override
					public void playlistLoaded(AudioPlaylist playlist) {
						if (!playlist.isSearchResult()) {
							plManager.playlistLoaded(playlist);
							return;
						}
						RichEmbed embed = new RichEmbed("Search Results").setColor(0x0).setDescription("Showing search results for: " + args[0]);
						for (int i = 0; i < 10; i++) {
							AudioTrackInfo info = playlist.getTracks().get(i).getInfo();
							String name = String.format("%d - %s", i + 1, playlist.getName());
							String t = String.format("[*%s*](%s)  by %s", info.title, info.uri, info.author);
							embed.addField(name, t);
						}
						
						channel.sendEmbed(embed);
					}
					
					@Override
					public void noMatches() {
						channel.sendMessage(String.format("No audio found at: %s", args[0]));
					}
					
					@Override
					public void loadFailed(FriendlyException exception) {
						String err = exception.toString();
						StackTraceElement[] trace = exception.getStackTrace();
						for (StackTraceElement traceElement : trace) {
							err += ("\tat " + traceElement);
						}
						channel.sendMessage(err);
					}
					
				});
			} else {
				plManager.startNext();
			}
		}
	}
}
