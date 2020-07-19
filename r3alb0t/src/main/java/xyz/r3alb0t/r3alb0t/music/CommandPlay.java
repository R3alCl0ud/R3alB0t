package xyz.r3alb0t.r3alb0t.music;

import java.time.OffsetDateTime;
import java.util.concurrent.CompletableFuture;

import com.sedmelluq.discord.lavaplayer.player.AudioLoadResultHandler;
import com.sedmelluq.discord.lavaplayer.tools.FriendlyException;
import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist;
import com.sedmelluq.discord.lavaplayer.track.AudioTrack;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackInfo;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.command.CommandHandler;
import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.message.embed.RichEmbed;
import io.discloader.discloader.entity.channel.IGuildTextChannel;
import io.discloader.discloader.entity.channel.ITextChannel;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.guild.IGuildMember;
import io.discloader.discloader.entity.message.IMessage;
import io.discloader.discloader.entity.voice.VoiceConnection;
import xyz.r3alb0t.r3alb0t.R3alB0t;

public class CommandPlay extends Command {

	public CommandPlay() {
		setUnlocalizedName("play");
		setDescription("adds a track/set to the playlist\n");
		setArgsRegex("(.*+)");
	}

	public Resource getResourceLocation() {
		return new Resource("r3alb0t", "texture/command/Play.png");
	}

	@Override
	public void execute(MessageCreateEvent e, String[] args) {
		IMessage message = e.getMessage();
		IGuild guild = message.getGuild();
		IGuildMember member = message.getMember();
		ITextChannel channel = message.getChannel();
		if (guild != null && RBMusic.plManagers.containsKey(guild.getID())) {
			PlaylistManager plManager = RBMusic.plManagers.get(guild.getID());
			if (args.length > 0) {
				String trackID = args[0];
				if (trackID.length() < 1) {
					return;
				}
				if (!trackID.toLowerCase().startsWith("http"))
					trackID = "ytsearch:" + trackID;
				plManager.getVoiceConnection().findTrackOrTracks(trackID, new AudioLoadResultHandler() {

					@Override
					public void trackLoaded(AudioTrack track) {
						plManager.trackLoaded(track, message.getAuthor());
					}

					@Override
					public void playlistLoaded(AudioPlaylist playlist) {
						if (!playlist.isSearchResult()) {
							plManager.playlistLoaded(playlist);
							return;
						}
						RBMusic.searchResults.put(guild.getID(), playlist);
						RichEmbed embed = new RichEmbed("Search Results").setColor(0x28a7f6).setDescription("Showing search results for: " + args[0]);
						for (int i = 0; i < 10; i++) {
							AudioTrackInfo info = playlist.getTracks().get(i).getInfo();
							String name = String.format("%d - %s", i + 1, playlist.getName());
							String t = String.format("[*%s*](%s)  by %s", info.title, info.uri, info.author);
							embed.addField(name, t);
						}
						embed.addField("Select a track", String.format("Type `%sselect <number>` to select a track from the search results", CommandHandler.prefix));
						embed.setFooter(R3alB0t.getCopyrightInfo()).setTimestamp(OffsetDateTime.now());
						channel.sendEmbed(embed);
					}

					@Override
					public void noMatches() {
						channel.sendMessage(String.format("No audio found at: %s", args[0]));
					}

					@Override
					public void loadFailed(FriendlyException exception) {
						exception.printStackTrace();
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
		} else if (guild != null && member != null && !RBMusic.plManagers.containsKey(guild.getID())) {
			CompletableFuture<VoiceConnection> future = RBMusic.joinVoice(member, (IGuildTextChannel) message.getChannel());
			future.thenAcceptAsync(vc -> {
				RichEmbed embed = new RichEmbed("Music Player").setColor(0x55cdF2);
				embed.setFooter(R3alB0t.getCopyrightInfo()).setTimestamp();
				embed.addField("Joined Voice", String.format("Joined the VoiceChannel *%s*", member.getVoiceChannel().getName()));
				e.getChannel().sendEmbed(embed);
				PlaylistManager plManager = RBMusic.plManagers.get(guild.getID());
				if (args.length > 0) {
					String trackID = args[0];
					if (trackID.length() < 1) {
						return;
					}
					if (!trackID.toLowerCase().startsWith("http"))
						trackID = "ytsearch:" + trackID;
					plManager.getVoiceConnection().findTrackOrTracks(trackID, new AudioLoadResultHandler() {

						@Override
						public void trackLoaded(AudioTrack track) {
							plManager.trackLoaded(track, message.getAuthor());
						}

						@Override
						public void playlistLoaded(AudioPlaylist playlist) {
							if (!playlist.isSearchResult()) {
								plManager.playlistLoaded(playlist);
								return;
							}
							RBMusic.searchResults.put(guild.getID(), playlist);
							RichEmbed embed = new RichEmbed("Search Results").setColor(0x28a7f6).setDescription("Showing search results for: " + args[0]);
							for (int i = 0; i < 10; i++) {
								AudioTrackInfo info = playlist.getTracks().get(i).getInfo();
								String name = String.format("%d - %s", i + 1, playlist.getName());
								String t = String.format("[*%s*](%s)  by %s", info.title, info.uri, info.author);
								embed.addField(name, t);
							}
							embed.addField("Select a track", String.format("Type `%sselect <number>` to select a track from the search results", CommandHandler.prefix));
							embed.setFooter(R3alB0t.getCopyrightInfo()).setTimestamp(OffsetDateTime.now());
							channel.sendEmbed(embed);
						}

						@Override
						public void noMatches() {
							channel.sendMessage(String.format("No audio found at: %s", args[0]));
						}

						@Override
						public void loadFailed(FriendlyException exception) {
							exception.printStackTrace();
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
			});
		} else {
			e.getChannel().sendMessage("I can only play music in a guild");
		}
	}
}
