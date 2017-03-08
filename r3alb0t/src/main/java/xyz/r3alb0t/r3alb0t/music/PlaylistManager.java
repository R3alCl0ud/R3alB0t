package xyz.r3alb0t.r3alb0t.music;

import com.sedmelluq.discord.lavaplayer.player.AudioLoadResultHandler;
import com.sedmelluq.discord.lavaplayer.tools.FriendlyException;
import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist;
import com.sedmelluq.discord.lavaplayer.track.AudioTrack;

import io.discloader.discloader.entity.channels.TextChannel;
import io.discloader.discloader.entity.channels.VoiceChannel;
import io.discloader.discloader.entity.voice.VoiceConnection;
import io.discloader.discloader.network.voice.StreamSchedule;

public class PlaylistManager extends StreamSchedule implements AudioLoadResultHandler {

	private VoiceChannel channel;
	private TextChannel boundChannel;

	public PlaylistManager(VoiceConnection connection, TextChannel boundChannel) {
		super(connection.player, connection);
		this.channel = connection.channel;
		this.boundChannel = boundChannel;
		// this.tracks
	}

	@Override
	public void loadFailed(FriendlyException arg0) {
	}

	@Override
	public void noMatches() {
		boundChannel.sendMessage("Unable to add requested track(s) to the playlist");
		// this.

	}

	@Override
	public void playlistLoaded(AudioPlaylist arg0) {
	}

	@Override
	public void trackLoaded(AudioTrack arg0) {
	}

}
