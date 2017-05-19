package xyz.r3alb0t.r3alb0t.music;

import java.util.ArrayList;
import java.util.List;

import com.sedmelluq.discord.lavaplayer.player.AudioLoadResultHandler;
import com.sedmelluq.discord.lavaplayer.tools.FriendlyException;
import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist;
import com.sedmelluq.discord.lavaplayer.track.AudioTrack;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackEndReason;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackInfo;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackState;

import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.message.MessageReactionAddEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.core.entity.user.DLUser;
import io.discloader.discloader.entity.IEmoji;
import io.discloader.discloader.entity.channel.ITextChannel;
import io.discloader.discloader.entity.message.IMessage;
import io.discloader.discloader.entity.voice.VoiceConnect;
import io.discloader.discloader.entity.voice.VoiceEventAdapter;

public class PlaylistManager extends VoiceEventAdapter implements AudioLoadResultHandler {
	
	private VoiceConnect connection;
	private ITextChannel boundChannel;
	private IMessage nowplaying;
	
	private List<AudioTrack> tracks;
	
	private Resource playing = new Resource("r3alb0t", "texture/command/Play.png");
	private Resource pause = new Resource("r3alb0t", "texture/command/Pause.png");
	private Resource rshuffle = new Resource("r3alb0t", "texture/command/shuffle.png");
	
	public PlaylistManager(VoiceConnect connection, ITextChannel boundChannel) {
		this.connection = connection;
		this.boundChannel = boundChannel;
		nowplaying = null;
		tracks = new ArrayList<>();
		connection.addListener(this);
		connection.getLoader().addEventHandler(new EventListenerAdapter() {
			
			public void MessageReactionAdd(MessageReactionAddEvent e) {
				if (nowplaying == null || e.getMessage().getID() != nowplaying.getID() || e.getLoader().user.getID() == e.getUser().getID()) return;
				
				IEmoji emoji = e.getReaction().getEmoji();
				if (emoji.toString().equals("⏸")) {
					connection.pause();
				} else if (emoji.toString().equals("🔀")) {
					shuffle();
					
					if (nowplaying != null) {
						nowplaying.deleteAllReactions().thenAcceptAsync(n -> {
							nowplaying.addReaction("⏸");
							nowplaying.addReaction("🔀");
							nowplaying.addReaction("🔄");
							if (tracks.size() > 1 && tracks.get(1) != null) nowplaying.addReaction("⏭");
						});
					}
					RichEmbed embed = new RichEmbed("Music Player").setColor(0x55cdF2);
					embed.addField("Shuffling", "Playlist has been shuffled");
					embed.setThumbnail(rshuffle);
					boundChannel.sendEmbed(embed).thenAcceptAsync(msg -> {
						
					});
				} else if (emoji.toString().equals("⏭") && tracks.size() >= 2) {
					connection.play(tracks.get(1));
				} else if (emoji.toString().equals("🔄")) {
					AudioTrackInfo info = connection.getPlayingTrack().getInfo();
					RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7);
					embed.addField("Now Playing", String.format("[*%s*](%s) - %s", info.title, info.uri, info.author));
					if (tracks.size() > 1 && tracks.get(1) != null) {
						AudioTrackInfo next = tracks.get(1).getInfo();
						embed.addField("Up Next", String.format("[*%s*](%s) - %s", next.title, next.uri, next.author));
					}
					embed.addField("Volume", String.format("%d", connection.getVolume()) + "%", true);
					embed.addField("Current Time", getTime(), true);
					embed.setThumbnail(playing);
					if (nowplaying != null) nowplaying.delete();
					boundChannel.sendEmbed(embed).thenAcceptAsync(msg -> {
						nowplaying = msg;
						nowplaying.addReaction("⏸").thenAccept(a -> {
							nowplaying.addReaction("🔀").thenAccept(b -> {
								nowplaying.addReaction("🔄").thenAccept(c -> {
									if (tracks.size() > 1 && tracks.get(1) != null) nowplaying.addReaction("⏭");
								});
							});
						});
					});
				} else if (emoji.toString().equals("▶")) {
					connection.resume();
				}
			}
		});
		
	}
	
	@Override
	public void end(AudioTrack track, AudioTrackEndReason endReason) {
		tracks.remove(track);
		if (endReason == AudioTrackEndReason.LOAD_FAILED) {
			boundChannel.sendMessage("Failed to load track");
		}
		if (endReason.mayStartNext) startNext();
	}
	
	public long getLength() {
		long l = 0;
		for (AudioTrack track : tracks) {
			l += (track.getDuration() / 1000l);
		}
		return l;
	}
	
	public String getTime() {
		long l = connection.getPlayingTrack().getDuration() / 1000l;
		long s = l % 60l;
		long m = l / 60l;
		long c = connection.getPlayingTrack().getPosition() / 1000l, cs = c % 60l, cm = c / 60l;
		return String.format("%02d:%02d/%d:%02d", cm, cs, m, s);
	}
	
	@Override
	public void loadFailed(FriendlyException e) {
		e.printStackTrace();
		boundChannel.sendMessage("Unable to add requested track(s) to the playlist");
	}
	
	public void loadTrack(String id) {
		connection.findTrackOrTracks(id, this);
	}
	
	@Override
	public void noMatches() {
		boundChannel.sendMessage("Unable to add requested track(s) to the playlist");
	}
	
	public void paused(AudioTrack track) {
		AudioTrackInfo info = connection.getPlayingTrack().getInfo();
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7);
		embed.addField("Paused", String.format("[*%s*](%s) - %s", info.title, info.uri, info.author));
		if (tracks.size() > 1 && tracks.get(1) != null) {
			AudioTrackInfo next = tracks.get(1).getInfo();
			embed.addField("Up Next", String.format("[*%s*](%s) - %s", next.title, next.uri, next.author));
		}
		embed.addField("Volume", String.format("%d", connection.getVolume()) + "%", true);
		embed.addField("Current Time", getTime(), true);
		embed.setThumbnail(pause);
		if (nowplaying != null) nowplaying.delete();
		boundChannel.sendEmbed(embed).thenAcceptAsync(msg -> {
			nowplaying = msg;
			nowplaying.addReaction("▶").thenAccept(a -> {
				nowplaying.addReaction("🔀").thenAccept(b -> {
					nowplaying.addReaction("🔄").thenAccept(c -> {
						if (tracks.size() > 1 && tracks.get(1) != null) nowplaying.addReaction("⏭");
					});
				});
			});
		});
	}
	
	public void pause() {
		connection.pause();
	}
	
	@Override
	public void playlistLoaded(AudioPlaylist tracks) {
		RichEmbed embed = new RichEmbed("Music PLayer").setColor(0x2566C7);
		DLUser user = connection.getLoader().user;
		embed.setAuthor(user.getUsername(), "http://discloader.io", user.getAvatar().toString());
		int i = 1;
		for (AudioTrack track : tracks.getTracks())
			this.tracks.add(track);
		for (AudioTrack track : tracks.getTracks()) {
			if (embed.getFields().size() == 5) {
				embed.addField("Total Tracks added", String.format("Added *%d* tracks", tracks.getTracks().size()));
				break;
			}
			AudioTrackInfo info = track.getInfo();
			String name = String.format("%s - %d", tracks.getName(), i);
			String t = String.format("[*%s*](%s)  by %s", info.title, info.uri, info.author);
			embed.addField(name, t);
			i++;
		}
		boundChannel.sendEmbed(embed);
		startNext();
	}
	
	public void shuffle() {
		if (tracks.size() < 3) return;
		if (connection.getPlayingTrack() != null) {
			for (int i = tracks.size() - 2; i > 1; i--) {
				int n = (int) Math.floor(Math.random() * (i));
				if (n != 0) {
					AudioTrack temp = tracks.get(i);
					tracks.set(i, tracks.get(n));
					tracks.set(n, temp);
				} else {
					i++;
				}
			}
		} else {
			for (int i = tracks.size() - 2; i > 0; i--) {
				int n = (int) Math.floor(Math.random() * (i));
				AudioTrack temp = tracks.get(i);
				tracks.set(i, tracks.get(n));
				tracks.set(n, temp);
			}
		}
	}
	
	@Override
	public void started(AudioTrack track) {
		AudioTrackInfo info = track.getInfo();
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7);
		embed.addField("Now Playing", String.format("[*%s*](%s) - %s", info.title, info.uri, info.author));
		if (tracks.size() > 1 && tracks.get(1) != null) {
			AudioTrackInfo next = tracks.get(1).getInfo();
			embed.addField("Up Next", String.format("[*%s*](%s) - %s", next.title, next.uri, next.author));
		}
		embed.addField("Volume", String.format("%d", connection.getVolume()) + "%", true);
		embed.addField("Current Time", getTime(), true);
		embed.setThumbnail(playing);
		if (nowplaying != null) nowplaying.delete();
		boundChannel.sendEmbed(embed).thenAcceptAsync(msg -> {
			nowplaying = msg;
			nowplaying.addReaction("⏸").thenAccept(a -> {
				nowplaying.addReaction("🔀").thenAccept(b -> {
					nowplaying.addReaction("🔄").thenAccept(c -> {
						if (tracks.size() > 1 && tracks.get(1) != null) nowplaying.addReaction("⏭");
					});
				});
			});
		});
	}
	
	public void startNext() {
		AudioTrack cp = connection.getPlayingTrack();
		if ((connection.isPaused() || cp == null || cp.getState() == AudioTrackState.FINISHED) && tracks.size() > 0) {
			System.out.println("starting next track");
			connection.play(tracks.get(0));
		} else {
			System.out.println("not starting a new track");
		}
	}
	
	@Override
	public void trackLoaded(AudioTrack track) {
		tracks.add(track);
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7);
		DLUser user = connection.getLoader().user;
		AudioTrackInfo info = track.getInfo();
		embed.setAuthor(user.getUsername(), info.uri, user.getAvatar().toString());
		embed.addField("Added Track", String.format("The track [*%s*](%s) by *%s* has been added to the playlist", info.title, info.uri, info.author));
		boundChannel.sendEmbed(embed);
		startNext();
	}
	
}
