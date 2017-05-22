package xyz.r3alb0t.r3alb0t.music;

import com.sedmelluq.discord.lavaplayer.source.AudioSourceManager;
import com.sedmelluq.discord.lavaplayer.track.AudioTrack;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackInfo;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackState;
import com.sedmelluq.discord.lavaplayer.track.TrackMarker;

import io.discloader.discloader.entity.user.IUser;

public class Song implements AudioTrack {

	private AudioTrack track;
	private IUser requester;

	public Song(AudioTrack track, IUser user) {
		this.track = track;
		requester = user;
	}

	@Override
	public long getDuration() {
		return track.getDuration();
	}

	@Override
	public String getIdentifier() {
		return track.getIdentifier();
	}

	@Override
	public AudioTrackInfo getInfo() {
		return track.getInfo();
	}

	@Override
	public long getPosition() {
		return track.getPosition();
	}

	public IUser getRequester() {
		return requester;
	}

	@Override
	public AudioSourceManager getSourceManager() {
		return track.getSourceManager();
	}

	@Override
	public AudioTrackState getState() {
		return track.getState();
	}

	@Override
	public boolean isSeekable() {
		return track.isSeekable();
	}

	@Override
	public AudioTrack makeClone() {
		return new Song(track.makeClone(), requester);
	}

	@Override
	public void setMarker(TrackMarker marker) {
		track.setMarker(marker);
	}

	@Override
	public void setPosition(long position) {
		track.setPosition(position);
	}

	@Override
	public void stop() {
		track.stop();
	}

}
