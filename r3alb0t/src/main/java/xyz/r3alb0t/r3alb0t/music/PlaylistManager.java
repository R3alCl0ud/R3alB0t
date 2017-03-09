package xyz.r3alb0t.r3alb0t.music;

import com.sedmelluq.discord.lavaplayer.player.AudioLoadResultHandler;
import com.sedmelluq.discord.lavaplayer.player.AudioPlayer;
import com.sedmelluq.discord.lavaplayer.tools.FriendlyException;
import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist;
import com.sedmelluq.discord.lavaplayer.track.AudioTrack;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackEndReason;

import io.discloader.discloader.entity.channels.TextChannel;
import io.discloader.discloader.entity.voice.VoiceConnection;
import io.discloader.discloader.network.voice.StreamSchedule;

public class PlaylistManager extends StreamSchedule implements AudioLoadResultHandler {

    private TextChannel boundChannel;

    public PlaylistManager(VoiceConnection connection, TextChannel boundChannel) {
        super(connection.player, connection, false);
        this.boundChannel = boundChannel;
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
        boundChannel.sendMessage("Starting next track");
    }

    @Override
    public void onTrackEnd(AudioPlayer player, AudioTrack track, AudioTrackEndReason endReason) {
        if (endReason == AudioTrackEndReason.LOAD_FAILED) {
            boundChannel.sendMessage("Failed to load track");
        } else {
            System.out.println(endReason);
            boundChannel.sendMessage("Track ended");
        }
    }

}
