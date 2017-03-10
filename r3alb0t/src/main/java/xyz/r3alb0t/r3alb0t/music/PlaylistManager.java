package xyz.r3alb0t.r3alb0t.music;

import com.sedmelluq.discord.lavaplayer.player.AudioLoadResultHandler;
import com.sedmelluq.discord.lavaplayer.player.AudioPlayer;
import com.sedmelluq.discord.lavaplayer.tools.FriendlyException;
import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist;
import com.sedmelluq.discord.lavaplayer.track.AudioTrack;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackEndReason;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackInfo;

import io.discloader.discloader.entity.RichEmbed;
import io.discloader.discloader.entity.channels.TextChannel;
import io.discloader.discloader.entity.user.DLUser;
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
		RichEmbed embed = new RichEmbed("Music PLayer").setColor(0x2566C7);
		DLUser user = connection.loader.user;
		embed.setAuthor(user.username, "http://discloader.io", user.avatar.toString());
		int i = 1;
		for (AudioTrack track : tracks.getTracks()) {
			if (embed.fields.size() == 23) {
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
	}

	@Override
	public void trackLoaded(AudioTrack track) {
		RichEmbed embed = new RichEmbed("Music PLayer").setColor(0x2566C7);
		DLUser user = connection.loader.user;
		AudioTrackInfo info = track.getInfo();
		System.out.println("" + info.length);
		embed.setAuthor(user.username, info.uri, user.avatar.toString());
		embed.addField("Added Track",
				String.format("The track *%s* by *%s* has been added to the playlist", info.title, info.author));
		// boundChannel.sendMessage("Added 1 track to the playlist.");
	}

	public void onTrackStart(AudioPlayer player, AudioTrack track) {
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7);
		embed.addField("Now Playing", String.format("*%s* - %s", track.getInfo().title, track.getInfo().author));
		if (tracks.size() > 1 && tracks.get(1) != null) {

			AudioTrackInfo info = tracks.get(1).getInfo();
			embed.addField("Up Next", String.format("*%s* - %s", info.title, info.author));
		}
		embed.addField("Volume", String.format("%d", player.getVolume()) + "%", true);
		embed.addField("Current Time", getTime(), true);
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
