package xyz.r3alb0t.r3alb0t.music;

import java.util.HashMap;
import java.util.Map;

import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist;

public class RBMusic {

	public static Map<Long, PlaylistManager> plManagers = new HashMap<>();
	public static Map<Long, AudioPlaylist> searchResults = new HashMap<>();
}
