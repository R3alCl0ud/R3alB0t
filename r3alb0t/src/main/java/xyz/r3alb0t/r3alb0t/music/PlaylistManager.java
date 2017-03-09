package xyz.r3alb0t.r3alb0t.music;

import com.sedmelluq.discord.lavaplayer.player.AudioLoadResultHandler;
import com.sedmelluq.discord.lavaplayer.player.AudioPlayer;
import com.sedmelluq.discord.lavaplayer.tools.FriendlyException;
import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist;
import com.sedmelluq.discord.lavaplayer.track.AudioTrack;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackEndReason;

import io.discloader.discloader.entity.RichEmbed;
import io.discloader.discloader.entity.channels.TextChannel;
import io.discloader.discloader.entity.voice.VoiceConnection;
import io.discloader.discloader.network.voice.StreamSchedule;

public class PlaylistManager extends StreamSchedule implements AudioLoadResultHandler {

	private TextChannel boundChannel;

	public PlaylistManager(VoiceConnection connection, TextChannel boundChannel) {
		super(connection.player, connection, false);
		this.boundChannel = boundChannel;
		connection.addListener(this);
	}

	@Override
	public void loadFailed(FriendlyException e) {
		e.printStackTrace();
		boundChannel.sendMessage("Unable to add requested track(s) to the playlist");
	}

	@Override
	public void noMatches() {
		boundChannel.sendMessage("Unable to add requested track(s) to the playlist");

	}

	@Override
	public void playlistLoaded(AudioPlaylist tracks) {
		boundChannel.sendMessage(String.format("Added %d track(s) to the playlist.", tracks.getTracks().size()));
	}

	@Override
	public void trackLoaded(AudioTrack arg0) {
		boundChannel.sendMessage("Added 1 track to the playlist.");
	}

	public void onTrackStart(AudioPlayer player, AudioTrack track) {
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7);
		embed.addField("Now Playing", String.format("*%s* - %s", track.getInfo().title, track.getInfo().author));
		if (tracks.size() > 1)
			embed.addField("Up Next",
					String.format("*%s* - %s", tracks.get(1).getInfo().title, tracks.get(1).getInfo().author));
		embed.addField("Volume", String.format("%d%", player.getVolume()), true).addField("Current Time", getTime(),
				true);
		boundChannel.sendEmbed(embed);
	}

	@Override
	public void onTrackEnd(AudioPlayer player, AudioTrack track, AudioTrackEndReason endReason) {
		if (endReason == AudioTrackEndReason.LOAD_FAILED) {
			boundChannel.sendMessage("Failed to load track");
		}
	}

	public String getTime() {
		long l = getLength();
		long m = l % 60;
		long h = l / 60;

		return String.format("00:00/%d:%d", h, m);
	}

	public long getLength() {
		long l = 0;
		for (AudioTrack track : tracks) {
			l += track.getDuration() / 1000;
		}
		return l;
	}

}
