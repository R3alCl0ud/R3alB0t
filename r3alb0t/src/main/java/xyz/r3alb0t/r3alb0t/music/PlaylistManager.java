package xyz.r3alb0t.r3alb0t.music;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import com.sedmelluq.discord.lavaplayer.player.AudioLoadResultHandler;
import com.sedmelluq.discord.lavaplayer.tools.FriendlyException;
import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist;
import com.sedmelluq.discord.lavaplayer.track.AudioTrack;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackEndReason;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackInfo;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackState;

import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.logger.DLLogger;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.core.entity.user.DLUser;
import io.discloader.discloader.entity.channel.IGuildTextChannel;
import io.discloader.discloader.entity.channel.IGuildVoiceChannel;
import io.discloader.discloader.entity.message.IMessage;
import io.discloader.discloader.entity.user.IUser;
import io.discloader.discloader.entity.voice.VoiceConnection;
import io.discloader.discloader.entity.voice.VoiceEventAdapter;
import xyz.r3alb0t.r3alb0t.R3alB0t;
import xyz.r3alb0t.r3alb0t.common.LogHandler;

public class PlaylistManager extends VoiceEventAdapter implements AudioLoadResultHandler {

	private VoiceConnection connection;
	private IGuildTextChannel boundChannel;
	private IMessage nowplaying;

	private List<AudioTrack> tracks;

	private long position = 0l;

	public static Resource playing = new Resource("r3alb0t", "texture/command/Play.png");
	public static Resource pause = new Resource("r3alb0t", "texture/command/Pause.png");

	public static final Logger logger = DLLogger.getLogger(PlaylistManager.class);

	String emo = "🔁 🔂 ⏸ 🔀 ⏭ 🔄 🔇 🔉 🔊";

	public PlaylistManager(VoiceConnection connection, IGuildTextChannel boundChannel) {
		this.connection = connection;
		this.boundChannel = boundChannel;
		nowplaying = null;
		tracks = new ArrayList<>();
		connection.addListener(this);
	}

	@Override
	public void end(AudioTrack track, AudioTrackEndReason endReason) {
		if (!connection.isPaused())
			tracks.remove(track);
		if (endReason == AudioTrackEndReason.LOAD_FAILED) {
			DLUser user = connection.getLoader().getSelfUser();
			RichEmbed embed = new RichEmbed("Music Player").setDescription("An error occurred while trying to play audio");
			embed.setAuthor(user.getUsername(), "http://r3alb0t.xyz", user.getAvatar().toString());
			embed.setFooter(R3alB0t.getCopyrightInfo()).setTimestamp();
			AudioTrackInfo info = track.getInfo();
			embed.addField("Error", "Failed to load track", true).addField("Track", String.format("[*%s*](%s) - %s", info.title, info.uri, info.author));
			boundChannel.sendMessage("Failed to load track");
		}
		if (endReason.mayStartNext)
			startNext();
	}

	public IGuildVoiceChannel getVoiceChannel() {
		return (IGuildVoiceChannel) connection.getChannel();
	}

	public VoiceConnection getVoiceConnection() {
		return connection;
	}

	public long getLength() {
		long l = 0;
		for (AudioTrack track : tracks) {
			l += (track.getDuration() / 1000l);
		}
		return l;
	}

	public AudioTrack getPlayingTrack() {
		AudioTrack track = connection.getPlayingTrack();
		return track == null && connection.isPaused() ? tracks.get(0) : track;
	}

	public String getTime() {
		return getTime(connection.getPlayingTrack());
	}

	public String getTime(AudioTrack track) {
		if (track == null)
			return "0:00/0:00";
		long l = track.getDuration() / 1000l;
		long s = l % 60l;
		long m = l / 60l;
		long c = track.getPosition() / 1000l, cs = c % 60l, cm = c / 60l;
		return String.format("%d:%02d/%d:%02d", cm, cs, m, s);
	}

	public String getLength(AudioTrack track) {
		long l = track.getDuration() / 1000l, m = l / 60l, s = l % 60l;
		return String.format("%d:%02d", m, s);
	}

	public List<AudioTrack> getTracks() {
		return tracks;
	}

	@Override
	public void loadFailed(FriendlyException e) {
		LogHandler.throwing(e);
		boundChannel.sendMessage("Unable to add requested track(s) to the playlist");
	}

	public void loadTrack(String id) {
		connection.findTrackOrTracks(id, this);
	}

	@Override
	public void noMatches() {
		boundChannel.sendMessage("Unable to add requested track(s) to the playlist");
	}

	public void pause() {
		position = connection.getPlayingTrack().getPosition();
		connection.pause();
	}

	public void paused(AudioTrack track) {
		AudioTrackInfo info = connection.getPlayingTrack().getInfo();
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7);
		embed.setFooter(R3alB0t.getCopyrightInfo()).setTimestamp();
		embed.addField("Paused", String.format("[*%s*](%s) - %s", info.title, info.uri, info.author));
		embed.addField("Volume", String.format("%d", connection.getVolume()) + "%", true);
		embed.addField("Current Time", getTime(), true);
		if (tracks.size() > 1 && tracks.get(1) != null) {
			AudioTrackInfo next = tracks.get(1).getInfo();
			embed.addField("Up Next", String.format("[*%s*](%s) - %s", next.title, next.uri, next.author));
		}
		embed.setThumbnail(pause);
		if (nowplaying != null)
			nowplaying.delete();
		boundChannel.sendEmbed(embed).thenAcceptAsync(msg -> {
			nowplaying = msg;
		});
	}

	@Override
	public void playlistLoaded(AudioPlaylist tracks) {
		RichEmbed embed = new RichEmbed("Music PLayer").setColor(0x2566C7);
		DLUser user = connection.getLoader().getSelfUser();
		embed.setAuthor(user.getUsername(), "http://r3alb0t.xyz", user.getAvatar().toString());
		embed.setFooter(R3alB0t.getCopyrightInfo()).setTimestamp();
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

	@Override
	public void resumed(AudioTrack track) {
		started(track);
	}

	public void shuffle() {
		if (tracks.size() < 3)
			return;
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
		sendEmbed();
	}

	public void startNext() {
		if (connection.isPaused()) {
			connection.resume();
			return;
		}
		AudioTrack cp = connection.getPlayingTrack();
		if ((cp == null || cp.getState() == AudioTrackState.FINISHED) && tracks.size() > 0) {
			logger.info("starting next track");
			connection.play(tracks.get(0));
		} else {
			logger.info("not starting a new track");
		}
	}

	public void skip() {
		if (connection.getPlayingTrack() == null) {
			startNext();
		} else if (tracks.size() >= 2 && tracks.get(1) != null) {
			connection.play(tracks.get(1));
		}
	}

	@Override
	public void trackLoaded(AudioTrack track) {
		tracks.add(track);
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7).setFooter(R3alB0t.getCopyrightInfo()).setTimestamp();
		DLUser user = connection.getLoader().user;
		AudioTrackInfo info = track.getInfo();
		embed.setAuthor(user.getUsername(), info.uri, user.getAvatar().toString());
		embed.addField("Added Track", String.format("The track [*%s*](%s) by *%s* has been added to the playlist", info.title, info.uri, info.author));
		boundChannel.sendEmbed(embed);
		startNext();
	}

	public void trackLoaded(AudioTrack track, IUser requester) {
		track.setUserData(requester);
		tracks.add(track);
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7).setFooter(R3alB0t.getCopyrightInfo()).setTimestamp();
		DLUser user = connection.getLoader().getSelfUser();
		AudioTrackInfo info = track.getInfo();
		embed.setAuthor(user.getUsername(), info.uri, user.getAvatar().toString());
		embed.addField("Added Track", String.format("The track [*%s*](%s) by *%s* has been added to the playlist", info.title, info.uri, info.author), true);
		embed.addField("Requested By", requester.toMention(), true);
		boundChannel.sendEmbed(embed);
		startNext();
	}

	private void sendEmbed() {
		AudioTrackInfo info = connection.getPlayingTrack().getInfo();
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7);
		embed.setFooter(R3alB0t.getCopyrightInfo()).setTimestamp();
		embed.addField("Now Playing", String.format("[*%s*](%s) - %s", info.title, info.uri, info.author), true);
		embed.addField("Requested By", connection.getPlayingTrack().getUserData(IUser.class).toMention(), true);
		embed.addField("Volume", String.format("%d", connection.getVolume()) + "%", true);
		embed.addField("Current Time", getTime(), true);
		if (tracks.size() > 1 && tracks.get(1) != null) {
			AudioTrackInfo next = tracks.get(1).getInfo();
			IUser req2 = tracks.get(1).getUserData(IUser.class);
			String upNext = String.format("[*%s*](%s) - %s", next.title, next.uri, next.author);
			if (req2 != null) {
				upNext = String.format("%s\n**Requested By:** %s", req2.toMention());
			}
			embed.addField("Up Next", upNext);

		}
		embed.setThumbnail(connection.isPaused() ? pause : playing);
		boundChannel.sendEmbed(embed);

	}

	public long getPosition() {
		return position;
	}

	public void setPosition(long position) {
		this.position = position;
	}
}
